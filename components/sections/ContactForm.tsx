'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button, Heading, cx } from '@/components/ui';
import { contact } from '@/content/site';
import {
  CONTACT_FIELDS,
  CONTACT_HONEYPOT_FIELD,
  CONTACT_LIMITS,
  INQUIRY_DATE_LABELS,
  INQUIRY_LABELS,
  INQUIRY_MESSAGE_HELP,
  INQUIRY_TYPES,
  contactPlainText,
  contactSubject,
  emptyContactValues,
  isInquiryType,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
  type ContactResponse,
  type ContactValues,
  type InquiryType,
} from '@/lib/contact';

/* ============================================================================
   ContactForm

   The inquiry form on /contact-us/. It posts JSON to /api/contact, which is
   the one server route on the site.

   THE BEHAVIOUR THIS COMPONENT EXISTS FOR. The API answers 501
   `no-provider-configured` when no delivery provider is set in the
   environment, and it answers 502 `provider-error` when one is set and it
   failed. In both cases, and on any network failure, the message did not
   arrive. This component then REPLACES ITSELF with the office email address
   and the phone number, plus a mailto: carrying everything that was typed, so
   nothing the visitor wrote is lost and the office is still reachable in one
   tap. A form that swallows a booking inquiry is worse than no form, which is
   why this route shipped without one until the endpoint existed to back it.

   VALIDATION runs twice on purpose. `validateContact` from lib/contact is
   imported here to show field errors without a round trip, and the same
   function runs on the server, because a check in a browser is a courtesy and
   never a validation.

   ANNOUNCEMENTS use two mechanisms, one per situation:
     - while the form is up, `.dm-form__status` is an always-mounted polite
       live region sitting above the submit button. Field errors and the
       rate-limit notice land there, and focus moves to it.
     - when the form is replaced by the result panel, the panel itself takes
       focus. A live region that mounts at the same moment it gains text is a
       live region a screen reader may never announce, so the outcome is
       carried by focus instead of by aria-live.
   ============================================================================ */

/**
 * editing     the form is up and accepting input.
 * submitting  a request is in flight. The controls are disabled.
 * sent        the API returned 200. The form is gone.
 * fallback    the message did not arrive. The form is gone and the email
 *             address and phone number stand in its place.
 */
type Phase = 'editing' | 'submitting' | 'sent' | 'fallback';

type StatusTone = 'neutral' | 'error';

type Status = { tone: StatusTone; text: string };

const NO_STATUS: Status = { tone: 'neutral', text: '' };

export type ContactFormProps = {
  /** Prefixes every generated id, so a second instance can never collide. */
  idPrefix?: string;
  /** Labels the <form> for assistive tech. Pass the id of the section heading. */
  labelledBy?: string;
  /** Preselects the route's intent while keeping the selector editable. */
  initialInquiryType?: InquiryType;
  className?: string;
};

/* --------------------------------------------------------------------------
   The mailto: the fallback hands over. It carries the subject line the office
   already recognises from the Resend path and the same plain-text body, so a
   message that failed to post arrives looking identical to one that did.
   -------------------------------------------------------------------------- */
function fallbackMailto(values: ContactValues): string {
  const typedSomething = CONTACT_FIELDS.some((field) => values[field].length > 0);
  if (!typedSomething) return `mailto:${contact.email}`;

  const who = values.organization || values.name;
  const subject = who ? contactSubject(values) : 'Website inquiry';

  return (
    `mailto:${contact.email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(contactPlainText(values))}`
  );
}

function trimValues(values: ContactValues): ContactValues {
  const trimmed = emptyContactValues();
  for (const field of CONTACT_FIELDS) trimmed[field] = values[field].trim();
  return trimmed;
}

function errorSummary(errors: ContactFieldErrors): string {
  const count = Object.keys(errors).length;
  return count === 1
    ? 'One field needs another look. It’s marked below.'
    : `${count} fields need another look. They’re marked below.`;
}

/* ==========================================================================
   One field
   Every control gets a real <label>. A placeholder is not a label: it
   disappears on the first keystroke, it is not reliably announced, and it
   fails at 200% zoom the same way it fails at 4am.
   ========================================================================== */
type FieldProps = {
  idBase: string;
  name: ContactField;
  label: string;
  value: string;
  onChange: (name: ContactField, value: string) => void;
  disabled: boolean;
  error?: string;
  help?: string;
  required?: boolean;
  multiline?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  maxLength?: number;
};

function Field({
  idBase,
  name,
  label,
  value,
  onChange,
  disabled,
  error,
  help,
  required = false,
  multiline = false,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
}: FieldProps) {
  const controlId = `${idBase}-${name}`;
  const helpId = `${idBase}-${name}-help`;
  const errorId = `${idBase}-${name}-error`;

  /* Error first, so a screen reader reads what is wrong before it reads the
     hint that was already there. */
  const describedBy = [error ? errorId : null, help ? helpId : null]
    .filter(Boolean)
    .join(' ');

  const shared = {
    className: cx('dm-field__control', multiline && 'dm-field__control--area'),
    id: controlId,
    name,
    value,
    disabled,
    required,
    maxLength,
    autoComplete,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': error ? (true as const) : undefined,
  };

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(name, event.target.value);
  }

  return (
    <div className="dm-field">
      <label className="dm-field__label" htmlFor={controlId}>
        {label}{' '}
        {required ? (
          /* The word, not a bare asterisk and not colour on its own. The
             `required` attribute is what carries this to assistive tech, so
             the visible mark is hidden from it rather than announced twice. */
          <span className="dm-field__required" aria-hidden="true">
            Required
          </span>
        ) : null}
      </label>

      {multiline ? (
        <textarea {...shared} rows={6} onChange={handleChange} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} onChange={handleChange} />
      )}

      {error ? (
        <span className="dm-field__error" id={errorId}>
          {error}
        </span>
      ) : null}

      {help ? (
        <span className="dm-field__help" id={helpId}>
          {help}
        </span>
      ) : null}
    </div>
  );
}

/* ==========================================================================
   The form
   ========================================================================== */
export function ContactForm({
  idPrefix = 'contact-form',
  labelledBy,
  initialInquiryType,
  className,
}: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(() =>
    emptyContactValues(initialInquiryType),
  );
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [phase, setPhase] = useState<Phase>('editing');
  const [status, setStatus] = useState<Status>(NO_STATUS);

  const honeypotRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  /* Set by the submit handler, consumed by the effect below. Focus cannot be
     moved from inside the handler: the element that should receive it either
     has not been told it is in an error state yet, or does not exist yet. */
  const focusTarget = useRef<'none' | 'status' | 'result'>('none');

  useEffect(() => {
    if (focusTarget.current === 'status') statusRef.current?.focus();
    else if (focusTarget.current === 'result') resultRef.current?.focus();
    focusTarget.current = 'none';
  });

  const busy = phase === 'submitting';
  const selectedInquiry = isInquiryType(values.inquiryType) ? values.inquiryType : undefined;
  const dateLabel = selectedInquiry ? INQUIRY_DATE_LABELS[selectedInquiry] : undefined;
  const messageHelp = selectedInquiry
    ? INQUIRY_MESSAGE_HELP[selectedInquiry]
    : 'Choose an inquiry type above and we’ll tell you what is most useful to include.';

  function updateField(name: ContactField, next: string) {
    setValues((current) => ({ ...current, [name]: next }));
    /* Clearing the error on the first keystroke, not on blur. The message has
       done its job the moment the visitor starts fixing the field, and leaving
       it up while they type reads as though the fix is not working. */
    setErrors((current) => {
      if (!current[name]) return current;
      const remaining = { ...current };
      delete remaining[name];
      return remaining;
    });
  }

  function updateInquiry(next: string) {
    updateField('inquiryType', next);
    if (!isInquiryType(next) || !INQUIRY_DATE_LABELS[next]) {
      updateField('eventDate', '');
    }
  }

  function failToFallback() {
    setPhase('fallback');
    setStatus(NO_STATUS);
    focusTarget.current = 'result';
  }

  function failInPlace(text: string) {
    setPhase('editing');
    setStatus({ tone: 'error', text });
    focusTarget.current = 'status';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const trimmed = trimValues(values);
    const found = validateContact(trimmed);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      failInPlace(errorSummary(found));
      return;
    }

    setErrors({});
    setPhase('submitting');
    setStatus({ tone: 'neutral', text: 'Sending it now.' });

    let response: Response;
    try {
      /* The trailing slash is load-bearing. next.config.ts sets
         `trailingSlash: true`, so /api/contact answers 308 to /api/contact/.
         fetch would follow it and 308 does preserve the method and the body,
         but that is a second round trip on every submission for nothing. */
      response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...trimmed,
          /* Read off the DOM, never off React state. React never writes to
             this input, so anything in it was put there by something that is
             not a person. */
          [CONTACT_HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
        }),
      });
    } catch {
      /* Offline, DNS, a blocked request, a dropped connection. The message did
         not arrive, so hand over the real paths. */
      failToFallback();
      return;
    }

    let body: ContactResponse | null = null;
    try {
      body = (await response.json()) as ContactResponse;
    } catch {
      body = null;
    }

    if (response.ok && body?.ok === true) {
      setPhase('sent');
      setStatus(NO_STATUS);
      focusTarget.current = 'result';
      return;
    }

    const code = body && body.ok === false ? body.code : undefined;

    /* Field errors the server caught and the browser did not. The typed values
       are already in state and stay exactly as they were. */
    if (code === 'invalid' && body && body.ok === false && body.errors) {
      setErrors(body.errors);
      failInPlace(errorSummary(body.errors));
      return;
    }

    if (code === 'rate-limited') {
      failInPlace(
        'That’s several messages from here in a short stretch. Give it ten minutes, or just call the office.',
      );
      return;
    }

    /* 501 no-provider-configured, 502 provider-error, and anything else this
       component was not expecting. In every one of those the message did not
       get through, so the form gets out of the way. */
    failToFallback();
  }

  /* ------------------------------------------------------------------------
     Sent
     ------------------------------------------------------------------------ */
  if (phase === 'sent') {
    return (
      /* tabIndex -1 and not 0: a focus destination, never a tab stop. */
      <div className={cx('dm-form__result', className)} ref={resultRef} tabIndex={-1}>
        <Heading level={3} size="lg">
          That’s away.
        </Heading>
        <p className="dm-form__result-note">
          Your message is in the office inbox with your address on it. Damian reads them, Lori
          keeps the calendar, and one of them will answer this one.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     Fallback. The whole reason the component is a client component.
     ------------------------------------------------------------------------ */
  if (phase === 'fallback') {
    return (
      <div className={cx('dm-form__result', className)} ref={resultRef} tabIndex={-1}>
        <Heading level={3} size="lg">
          The form didn’t go through.
        </Heading>
        <p className="dm-form__result-note">
          Nothing was sent, so don’t wait on a reply to it. Use the address or the number below and
          you get the same two people. The button opens a draft with everything you just typed
          already in it.
        </p>

        <div>
          <Button href={fallbackMailto(values)} variant="primary">
            Open this in your email
          </Button>
        </div>

        <dl className="dm-form__paths">
          <div className="dm-form__path">
            <dt className="dm-field__label">Email</dt>
            <dd>
              <a className="dm-form__path-value dm-link-bare" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </dd>
          </div>
          <div className="dm-form__path">
            <dt className="dm-field__label">Phone</dt>
            <dd>
              <a className="dm-form__path-value dm-link-bare" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     Editing and submitting
     ------------------------------------------------------------------------ */
  return (
    <form
      className={cx('dm-form', className)}
      id={`${idPrefix}-form`}
      onSubmit={handleSubmit}
      aria-labelledby={labelledBy}
      aria-busy={busy || undefined}
      /* The browser's own bubbles are unstyled, untranslatable, disappear on
         scroll and say "Please fill out this field". lib/contact says what is
         actually wrong, in the site's own voice, and it says it in the page. */
      noValidate
    >
      <p className="dm-field__help">
        Pick the reason first. The form will ask only for the details that help the office answer.
      </p>

      <div className="dm-form__fields">
        <div className="dm-field">
          <label className="dm-field__label" htmlFor={`${idPrefix}-inquiryType`}>
            What are you reaching out about?{' '}
            <span className="dm-field__required" aria-hidden="true">
              Required
            </span>
          </label>
          <select
            className="dm-field__control"
            id={`${idPrefix}-inquiryType`}
            name="inquiryType"
            value={values.inquiryType}
            disabled={busy}
            required
            aria-invalid={errors.inquiryType ? true : undefined}
            aria-describedby={
              errors.inquiryType ? `${idPrefix}-inquiryType-error` : undefined
            }
            onChange={(event) => updateInquiry(event.target.value)}
          >
            <option value="">Choose one</option>
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {INQUIRY_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.inquiryType ? (
            <span className="dm-field__error" id={`${idPrefix}-inquiryType-error`}>
              {errors.inquiryType}
            </span>
          ) : null}
        </div>
      </div>

      <div className="dm-form__fields dm-form__fields--pair">
        <Field
          idBase={idPrefix}
          name="name"
          label="Your name"
          value={values.name}
          onChange={updateField}
          disabled={busy}
          error={errors.name}
          required
          autoComplete="name"
          maxLength={CONTACT_LIMITS.nameMax}
        />
        <Field
          idBase={idPrefix}
          name="email"
          label="Email address"
          value={values.email}
          onChange={updateField}
          disabled={busy}
          error={errors.email}
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={CONTACT_LIMITS.emailMax}
        />
      </div>

      <div className="dm-form__fields dm-form__fields--pair">
        <Field
          idBase={idPrefix}
          name="organization"
          label="Organization"
          value={values.organization}
          onChange={updateField}
          disabled={busy}
          error={errors.organization}
          help="Optional. The association, the co-op, the company, whoever is putting on the event."
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.organizationMax}
        />
        <Field
          idBase={idPrefix}
          name="phone"
          label="Phone"
          value={values.phone}
          onChange={updateField}
          disabled={busy}
          error={errors.phone}
          help="Optional. Worth adding if the date is close."
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={CONTACT_LIMITS.phoneMax}
        />
      </div>

      {dateLabel ? (
        <div className="dm-form__fields">
          <Field
            idBase={idPrefix}
            name="eventDate"
            label={dateLabel}
            value={values.eventDate}
            onChange={updateField}
            disabled={busy}
            error={errors.eventDate}
            help="Optional. If you have a window rather than a day, put the window in the message."
            type="date"
            autoComplete="off"
          />
        </div>
      ) : null}

      <div className="dm-form__fields">
        <Field
          idBase={idPrefix}
          name="message"
          label="Your message"
          value={values.message}
          onChange={updateField}
          disabled={busy}
          error={errors.message}
          help={messageHelp}
          required
          multiline
          maxLength={CONTACT_LIMITS.messageMax}
        />
      </div>

      {/* The bot trap. In the DOM, empty, clipped out of sight by CSS and out
          of the accessibility tree by aria-hidden plus tabindex. Anything that
          arrives with a value here gets a 200 and goes nowhere. Never give it
          a value, an autofill hint, or a name a password manager likes. */}
      <div className="dm-form__honeypot" aria-hidden="true">
        <label htmlFor={`${idPrefix}-${CONTACT_HONEYPOT_FIELD}`}>Leave this field empty</label>
        <input
          ref={honeypotRef}
          type="text"
          id={`${idPrefix}-${CONTACT_HONEYPOT_FIELD}`}
          name={CONTACT_HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {/* The status line sits in the same block as the button rather than as a
          sibling in the form's flex column, so an empty one contributes no gap
          and the button does not move when a message appears above it.

          Always mounted and never display:none. It is empty until it has
          something to say, and it says it in place. See the note in
          sections.css: a live region that is created, or unhidden, in the same
          frame as its text is one a screen reader can miss. */}
      <div>
        <p
          className={cx('dm-form__status', status.tone === 'error' && 'dm-form__status--error')}
          id={`${idPrefix}-status`}
          ref={statusRef}
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          {status.text}
        </p>

        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? 'Sending' : 'Send it'}
        </Button>
        <p className="dm-field__help">
          See how this form and the newsletter handle information in the{' '}
          <Link href="/privacy/">privacy notice</Link>.
        </p>
      </div>
    </form>
  );
}

export default ContactForm;
