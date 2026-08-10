import type { ReactNode } from 'react';
import { newsletter } from '@/content/site';
import { Button, Heading, cx } from '@/components/ui';

export type NewsletterFormProps = {
  /**
   * Prefixes every generated id. The form runs in the footer and again on the
   * newsletter route, and two instances on one page cannot share an id.
   */
  idPrefix?: string;
  title?: ReactNode;
  blurb?: ReactNode;
  /** Rank of the title. Appearance stays fixed at --fs-xl. */
  headingLevel?: 2 | 3 | 4;
  /** Drops the name fields, for the footer where a single field is enough. */
  nameFields?: boolean;
  submitLabel?: string;
  /**
   * The orange field is one per viewport. The footer instance sits under a CTA
   * band that already spends it, so pass 'secondary' there.
   */
  submitVariant?: 'primary' | 'secondary';
  className?: string;
};

/**
 * Mailchimp's embedded form, rebuilt.
 *
 * It posts straight to the real audience endpoint in content/site.ts with the
 * field names that audience already knows, FNAME, LNAME and EMAIL, so nothing
 * about the subscriber list changes. `target="_blank"` is what Mailchimp
 * expects: the response renders on their domain and the visitor keeps the page
 * they were reading.
 *
 * No client JavaScript. A plain HTML form posting to a third party needs none,
 * which also means it works before hydration and with scripting off.
 *
 * Every field has a real `<label>`. A placeholder is not a label: it vanishes
 * on the first keystroke and screen reader support for it is inconsistent.
 */
export function NewsletterForm({
  idPrefix = 'newsletter',
  title = 'Add yourself to the list.',
  blurb = 'One email when there’s something worth your time: Ag news you can use, plus where Damian is speaking next. No daily clutter, no pitches.',
  headingLevel = 2,
  nameFields = true,
  submitLabel = 'Join the list',
  submitVariant = 'primary',
  className,
}: NewsletterFormProps) {
  const titleId = `${idPrefix}-title`;
  const firstNameId = `${idPrefix}-first-name`;
  const lastNameId = `${idPrefix}-last-name`;
  const emailId = `${idPrefix}-email`;
  const emailHelpId = `${idPrefix}-email-help`;
  const honeypotId = `${idPrefix}-honeypot`;

  return (
    <form
      className={cx('dm-form', className)}
      action={newsletter.action}
      method="post"
      target="_blank"
      rel="noopener noreferrer"
      name="mc-embedded-subscribe-form"
      id={`${idPrefix}-form`}
      aria-labelledby={title ? titleId : undefined}
    >
      {title ? (
        <Heading level={headingLevel} size="xl" id={titleId}>
          {title}
        </Heading>
      ) : null}

      {blurb ? <p className="dm-field__help">{blurb}</p> : null}

      {nameFields ? (
        <div className="dm-form__fields dm-form__fields--pair">
          <div className="dm-field">
            <label className="dm-field__label" htmlFor={firstNameId}>
              First name
            </label>
            <input
              className="dm-field__control"
              type="text"
              id={firstNameId}
              name={newsletter.fields.firstName}
              autoComplete="given-name"
            />
          </div>
          <div className="dm-field">
            <label className="dm-field__label" htmlFor={lastNameId}>
              Last name
            </label>
            <input
              className="dm-field__control"
              type="text"
              id={lastNameId}
              name={newsletter.fields.lastName}
              autoComplete="family-name"
            />
          </div>
        </div>
      ) : null}

      <div className="dm-form__fields">
        <div className="dm-field">
          <label className="dm-field__label" htmlFor={emailId}>
            Email address{' '}
            <span className="dm-field__required" aria-hidden="true">
              *
            </span>
          </label>
          <input
            className="dm-field__control"
            type="email"
            id={emailId}
            name={newsletter.fields.email}
            autoComplete="email"
            inputMode="email"
            required
            aria-describedby={emailHelpId}
          />
          <span className="dm-field__help" id={emailHelpId}>
            Required. Unsubscribe from the bottom of any email.
          </span>
        </div>
      </div>

      {/* Mailchimp's bot trap. It has to be in the DOM, it has to stay empty,
          and it has to be invisible to a sighted visitor and absent from the
          accessibility tree: clipped by CSS, aria-hidden, and out of the tab
          order. Never add a value to it. */}
      <div className="dm-form__honeypot" aria-hidden="true">
        <label htmlFor={honeypotId}>Leave this field empty</label>
        <input
          type="text"
          id={honeypotId}
          name={newsletter.honeypot}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div>
        <Button
          type="submit"
          variant={submitVariant}
          name="subscribe"
          id={`${idPrefix}-subscribe`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default NewsletterForm;
