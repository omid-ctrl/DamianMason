/**
 * The contact form's contract, shared by the Route Handler and the client
 * component so the two cannot drift.
 *
 * Everything in this file is pure: no secrets, no environment reads, no Node
 * built-ins. That is deliberate. The client imports `validateContact` to show
 * field errors without a round trip, and `app/api/contact/route.ts` imports the
 * same function to do the real check, because a browser check is a courtesy and
 * never a validation.
 *
 * The error strings are the strings a visitor reads, so they are written to
 * docs/VOICE.md like any other copy on the site.
 */

export const CONTACT_FIELDS = [
  'name',
  'email',
  'phone',
  'organization',
  'eventDate',
  'message',
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

/** The one input that is never rendered to a person. See ContactForm. */
export const CONTACT_HONEYPOT_FIELD = 'website';

export type ContactValues = Record<ContactField, string>;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

/**
 * Machine-readable outcomes. The client switches on these, never on the prose.
 *
 * invalid                 one or more fields failed. `errors` is populated.
 * rate-limited            too many posts from one address inside the window.
 * no-provider-configured  no delivery provider is set in the environment, so
 *                         the server refuses to accept a message it cannot
 *                         deliver. HTTP 501. The form falls back to email
 *                         and phone rather than swallowing the submission.
 * provider-error          a provider is configured and it failed or timed out.
 * bad-request             the body was not a form or not JSON.
 */
export type ContactErrorCode =
  | 'invalid'
  | 'rate-limited'
  | 'no-provider-configured'
  | 'provider-error'
  | 'bad-request';

export type ContactResponse =
  | { ok: true }
  | { ok: false; code: ContactErrorCode; errors?: ContactFieldErrors };

/* --- limits ---------------------------------------------------------------
   Maxima are generous enough that no real inquiry hits them and tight enough
   that the request body stays small. The message minimum is the only floor
   that a genuine sender can trip, so it is low: two short lines. */
export const CONTACT_LIMITS = {
  nameMax: 120,
  emailMax: 254, // RFC 5321 maximum path length.
  phoneMax: 40,
  organizationMax: 160,
  messageMin: 20,
  messageMax: 4000,
} as const;

/**
 * Deliberately permissive. The only address format check that is ever correct
 * is sending mail to it, so this rejects the shapes that are certainly wrong
 * (no @, no dot in the domain, whitespace) and lets everything else through to
 * the provider.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/** yyyy-mm-dd, which is what <input type="date"> submits. */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** At least seven digits somewhere in the string. Extensions, dots, parens and
 *  a country code all survive that test; "call me" does not. */
const PHONE_DIGITS = /\d/g;

export function emptyContactValues(): ContactValues {
  return {
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventDate: '',
    message: '',
  };
}

function isRealCalendarDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/**
 * Returns a field-keyed error map. Empty object means the submission is good.
 * Values are trimmed by the caller before they get here.
 */
export function validateContact(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!values.name) {
    errors.name = 'We need a name to put on the reply.';
  } else if (values.name.length > CONTACT_LIMITS.nameMax) {
    errors.name = 'That name is longer than the box takes.';
  }

  if (!values.email) {
    errors.email = 'We need an address to answer.';
  } else if (values.email.length > CONTACT_LIMITS.emailMax || !EMAIL_PATTERN.test(values.email)) {
    errors.email = 'That address won’t work. Check the @ and the domain.';
  }

  if (values.phone) {
    const digits = values.phone.match(PHONE_DIGITS)?.length ?? 0;
    if (digits < 7 || values.phone.length > CONTACT_LIMITS.phoneMax) {
      errors.phone = 'That isn’t a phone number. Leave it blank if you’d rather email.';
    }
  }

  if (values.organization && values.organization.length > CONTACT_LIMITS.organizationMax) {
    errors.organization = 'That name is longer than the box takes.';
  }

  if (values.eventDate) {
    if (!DATE_PATTERN.test(values.eventDate) || !isRealCalendarDate(values.eventDate)) {
      errors.eventDate = 'Use the date picker, or leave it blank.';
    }
  }

  if (values.message.length < CONTACT_LIMITS.messageMin) {
    errors.message = 'Give us a couple of lines to work with.';
  } else if (values.message.length > CONTACT_LIMITS.messageMax) {
    errors.message = 'That’s longer than the box takes. Trim it and send the rest by email.';
  }

  return errors;
}

/** The subject line the office sees, on both providers. */
export function contactSubject(values: ContactValues): string {
  const who = values.organization || values.name;
  return `Website inquiry: ${who}`;
}

/**
 * The plain-text body, used for the Resend email and for the mailto: fallback
 * when no provider is configured. Optional fields that were left blank are
 * omitted rather than printed as empty labels.
 */
export function contactPlainText(values: ContactValues): string {
  const lines: string[] = [`Name: ${values.name}`, `Email: ${values.email}`];
  if (values.phone) lines.push(`Phone: ${values.phone}`);
  if (values.organization) lines.push(`Organization: ${values.organization}`);
  if (values.eventDate) lines.push(`Event date: ${values.eventDate}`);
  lines.push('', values.message);
  return lines.join('\n');
}
