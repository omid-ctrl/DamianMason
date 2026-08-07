import type { ComponentPropsWithoutRef } from 'react';
import { Eyebrow, cx } from '@/components/ui';
import { contact } from '@/content/site';

export type FooterContactProps = {
  className?: string;
} & Omit<ComponentPropsWithoutRef<'dl'>, 'className'>;

/**
 * The old site kept the email and the phone number in the top utility bar and
 * put neither in the footer. Both live here now, and both are real links.
 *
 * The mailto carries its scheme. The Contact page's copy of this address
 * shipped as href="damianmasonoffice@gmail.com" with the scheme missing, which
 * resolved to /contact-us/damianmasonoffice@gmail.com and 404ed. The phone
 * number was a bare <span> and could not be tapped.
 */
export function FooterContact({ className, ...rest }: FooterContactProps) {
  return (
    <dl className={cx('dm-footer__contact', className)} {...rest}>
      <div className="dm-footer__contact-row">
        <dt>
          <Eyebrow>Email</Eyebrow>
        </dt>
        <dd>
          <a className="dm-footer__value dm-link-bare" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </dd>
      </div>

      <div className="dm-footer__contact-row">
        <dt>
          <Eyebrow>Phone</Eyebrow>
        </dt>
        <dd>
          <a className="dm-footer__value dm-link-bare" href={contact.phoneHref}>
            {contact.phone}
          </a>
        </dd>
      </div>

      <div className="dm-footer__contact-row">
        <dt>
          <Eyebrow>Based in</Eyebrow>
        </dt>
        <dd>
          <span className="dm-footer__value">Indiana</span>
        </dd>
      </div>
    </dl>
  );
}

export default FooterContact;
