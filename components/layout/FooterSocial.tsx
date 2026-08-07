import type { ComponentPropsWithoutRef } from 'react';
import { SocialIcon, cx } from '@/components/ui';
import { site, socials } from '@/content/site';

export type FooterSocialProps = {
  className?: string;
} & Omit<ComponentPropsWithoutRef<'ul'>, 'className'>;

/**
 * All five profiles were declared in the live site's JSON-LD Organization
 * sameAs and linked from nowhere in the visible page. They are links now.
 *
 * The glyph is aria-hidden and the accessible name is real text, so the row
 * reads as "Damian Mason on LinkedIn" rather than as five unlabelled graphics.
 * Each target is at least 44 by 44, which is the floor for every control in
 * this system.
 */
export function FooterSocial({ className, ...rest }: FooterSocialProps) {
  return (
    <ul className={cx('dm-footer__social', className)} {...rest}>
      {socials.map((social) => (
        <li key={social.icon}>
          <a
            className="dm-footer__social-link dm-link-bare"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon name={social.icon} />
            <span className="sr-only">{`${site.name} on ${social.label}, opens in a new tab`}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default FooterSocial;
