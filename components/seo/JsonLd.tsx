import { serializeJsonLd, type JsonLdDocument } from '@/lib/schema';

/**
 * Renders one or more JSON-LD nodes into a single script tag.
 *
 * Server component. There is no interactivity here and no reason for this to
 * cost a byte of client JavaScript.
 *
 * The payload goes through `serializeJsonLd`, which escapes `<`, `>` and `&`
 * to their \u form. That is what makes `dangerouslySetInnerHTML` safe here: no
 * substring of the serialized output can close the script tag or open a new
 * one, even if a testimonial or an FAQ answer contains markup.
 */
export type JsonLdProps = {
  /** A single node, or an array rendered as a JSON-LD list in one script. */
  schema: JsonLdDocument | JsonLdDocument[];
  /** Optional DOM id, useful when a page emits several blocks. */
  id?: string;
  className?: string;
};

export function JsonLd({ schema, id, className }: JsonLdProps) {
  const payload = serializeJsonLd(schema);

  return (
    <script
      type="application/ld+json"
      id={id}
      className={className}
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
