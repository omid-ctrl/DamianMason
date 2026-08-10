'use client';

import { useSearchParams } from 'next/navigation';

import { isInquiryType } from '@/lib/contact';
import { ContactForm, type ContactFormProps } from './ContactForm';

type ContactFormFromQueryProps = Omit<ContactFormProps, 'initialInquiryType'>;

export function ContactFormFromQuery(props: ContactFormFromQueryProps) {
  const searchParams = useSearchParams();
  const requested = searchParams.get('intent') ?? '';
  const inquiryType = isInquiryType(requested) ? requested : undefined;

  return (
    <ContactForm
      key={inquiryType ?? 'unselected'}
      {...props}
      initialInquiryType={inquiryType}
    />
  );
}
