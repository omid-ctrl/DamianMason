/**
 * POST /api/contact
 *
 * The one server endpoint on the site. Everything else prerenders to static
 * HTML; this handler exists because a speaker's booking inquiry is worth a
 * server round trip and a mailto: is not always reachable from a phone.
 *
 * THE RULE THIS ENDPOINT IS BUILT AROUND: it never accepts a message it cannot
 * deliver. With no provider in the environment it answers 501
 * `no-provider-configured`, and the form on /contact-us/ replaces itself with
 * the email address and the phone number. A form that returns 200 into a void
 * is worse than no form, which is why the site shipped without one.
 *
 * PROVIDERS, in the order they are tried:
 *
 *   1. RESEND_API_KEY + CONTACT_TO_EMAIL
 *      POSTs to the Resend REST API with fetch. No SDK, no dependency added to
 *      package.json, nothing to keep patched.
 *
 *   2. CONTACT_WEBHOOK_URL
 *      POSTs the JSON payload to any endpoint that accepts JSON: Formspree,
 *      Web3Forms, a Zapier catch hook, a Make webhook, an internal service.
 *
 * If neither is set: 501.
 *
 * SECRETS stay here. The key is read from the server environment inside this
 * handler and is never in the client bundle, never in a data attribute and
 * never in a response body.
 *
 * PRIVACY. Nothing in this file logs the message body or the sender's address.
 * The only console output is a provider failure, and it carries the provider
 * name and the HTTP status, nothing else.
 */

import {
  CONTACT_HONEYPOT_FIELD,
  contactPlainText,
  contactSubject,
  emptyContactValues,
  validateContact,
  type ContactResponse,
  type ContactValues,
} from '@/lib/contact';

/** Node, not Edge: the in-memory rate limiter wants the longer-lived instance
 *  that Vercel's Node runtime gives it, and nothing here needs Edge latency. */
export const runtime = 'nodejs';

/* ==========================================================================
   Rate limiting
   A fixed window held in module scope. This is per serverless instance and it
   RESETS ON EVERY COLD START, and a busy deploy runs several instances at
   once, so the real ceiling is (instances x MAX_PER_WINDOW). That is fine for
   what this is: a brake on a script hammering one form, not a security
   control. The honeypot and the provider's own abuse handling do the rest.
   Anything stronger needs shared state (Upstash, Vercel KV) and a paid add-on,
   which is a decision for the owner, not a default.
   ========================================================================== */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
/** Hard cap so a spray of forged X-Forwarded-For values cannot grow the map
 *  without bound between cold starts. */
const MAX_TRACKED_CLIENTS = 5000;

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function overLimit(key: string): boolean {
  const now = Date.now();

  for (const [tracked, window] of windows) {
    if (window.resetAt <= now) windows.delete(tracked);
  }

  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_CLIENTS) return true;
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_PER_WINDOW;
}

/* ==========================================================================
   Body parsing
   Accepts JSON (what the client component sends) and multipart or urlencoded
   form data (what a no-JavaScript POST would send), so the endpoint is not
   coupled to one caller.
   ========================================================================== */
function asString(value: FormDataEntryValue | unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The honeypot, read loosely on purpose. `asString` returns '' for anything
 * that is not a string, so a bot posting `{"website": true}` or
 * `{"website": 1}` would have walked straight past a `typeof value ===
 * 'string'` check. Anything present and not empty is a trap hit.
 */
function trapped(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * The largest body worth parsing. CONTACT_LIMITS caps the message at 4000
 * characters and every other field well below that, so a legitimate
 * submission is a couple of kilobytes. Checking Content-Length first means a
 * megabyte of junk is refused before `request.json()` pulls it into memory.
 * A request with no Content-Length is let through: streamed bodies do not
 * carry one, and validation catches an oversized field regardless.
 */
const MAX_BODY_BYTES = 64 * 1024;

function tooLarge(request: Request): boolean {
  const declared = Number(request.headers.get('content-length'));
  return Number.isFinite(declared) && declared > MAX_BODY_BYTES;
}

type ParsedBody = { values: ContactValues; honeypot: boolean } | null;

async function parseBody(request: Request): Promise<ParsedBody> {
  const contentType = request.headers.get('content-type') || '';
  const values = emptyContactValues();

  try {
    if (contentType.includes('application/json')) {
      const raw: unknown = await request.json();
      if (!raw || typeof raw !== 'object') return null;
      const record = raw as Record<string, unknown>;
      values.name = asString(record.name);
      values.email = asString(record.email);
      values.phone = asString(record.phone);
      values.organization = asString(record.organization);
      values.eventDate = asString(record.eventDate);
      values.message = asString(record.message);
      return { values, honeypot: trapped(record[CONTACT_HONEYPOT_FIELD]) };
    }

    if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const form = await request.formData();
      values.name = asString(form.get('name'));
      values.email = asString(form.get('email'));
      values.phone = asString(form.get('phone'));
      values.organization = asString(form.get('organization'));
      values.eventDate = asString(form.get('eventDate'));
      values.message = asString(form.get('message'));
      return { values, honeypot: trapped(form.get(CONTACT_HONEYPOT_FIELD)) };
    }
  } catch {
    return null;
  }

  return null;
}

/* ==========================================================================
   Delivery
   ========================================================================== */
type DeliveryResult = 'sent' | 'no-provider' | 'failed';

const PROVIDER_TIMEOUT_MS = 10_000;

async function deliverWithResend(values: ContactValues): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return 'no-provider';

  /* Resend refuses an unverified From. onboarding@resend.dev is their shared
     sender and it works with no DNS at all, which is what makes the two-key
     setup work on the first try. Once the owner verifies damianmason.com in
     Resend, CONTACT_FROM_EMAIL should be set to an address on it. */
  const from = process.env.CONTACT_FROM_EMAIL || 'Damian Mason Website <onboarding@resend.dev>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        /* The office hits reply and it goes to the sender, not to the site. */
        reply_to: values.email,
        subject: contactSubject(values),
        text: contactPlainText(values),
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`[contact] resend rejected the send, status ${response.status}`);
      return 'failed';
    }
    return 'sent';
  } catch {
    console.error('[contact] resend request failed or timed out');
    return 'failed';
  }
}

async function deliverWithWebhook(values: ContactValues): Promise<DeliveryResult> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return 'no-provider';

  const subject = contactSubject(values);

  /* Flat keys and a stable shape: every key is always present, empty string
     when the sender left it blank, so a downstream mapping never sees a field
     appear and disappear. `_subject` is Formspree's convention and is ignored
     by everything else. `access_key` is Web3Forms' and is only added when the
     owner has set one. */
  const payload: Record<string, string> = {
    source: 'damianmason.com',
    form: 'contact',
    receivedAt: new Date().toISOString(),
    subject,
    _subject: subject,
    name: values.name,
    email: values.email,
    phone: values.phone,
    organization: values.organization,
    eventDate: values.eventDate,
    message: values.message,
  };

  const accessKey = process.env.CONTACT_WEBHOOK_ACCESS_KEY;
  if (accessKey) payload.access_key = accessKey;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const token = process.env.CONTACT_WEBHOOK_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`[contact] webhook rejected the post, status ${response.status}`);
      return 'failed';
    }
    return 'sent';
  } catch {
    console.error('[contact] webhook request failed or timed out');
    return 'failed';
  }
}

async function deliver(values: ContactValues): Promise<DeliveryResult> {
  const viaResend = await deliverWithResend(values);
  if (viaResend !== 'no-provider') return viaResend;

  const viaWebhook = await deliverWithWebhook(values);
  if (viaWebhook !== 'no-provider') return viaWebhook;

  return 'no-provider';
}

/* ==========================================================================
   Handler
   ========================================================================== */
function json(body: ContactResponse, status: number): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (tooLarge(request)) return json({ ok: false, code: 'bad-request' }, 413);

  const parsed = await parseBody(request);
  if (!parsed) return json({ ok: false, code: 'bad-request' }, 400);

  /* The honeypot is checked before anything else and before the rate limiter,
     so a bot never learns it was caught and never consumes a real visitor's
     budget. It gets a 200 and its message goes nowhere. */
  if (parsed.honeypot) return json({ ok: true }, 200);

  if (overLimit(clientKey(request))) {
    return json({ ok: false, code: 'rate-limited' }, 429);
  }

  const errors = validateContact(parsed.values);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, code: 'invalid', errors }, 400);
  }

  const result = await deliver(parsed.values);

  if (result === 'no-provider') {
    return json({ ok: false, code: 'no-provider-configured' }, 501);
  }
  if (result === 'failed') {
    return json({ ok: false, code: 'provider-error' }, 502);
  }

  return json({ ok: true }, 200);
}

/** Anything that is not a POST. Answering explicitly keeps a crawler from
 *  logging a 500 against the route. */
export function GET(): Response {
  return Response.json(
    { ok: false, code: 'bad-request' } satisfies ContactResponse,
    { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } },
  );
}
