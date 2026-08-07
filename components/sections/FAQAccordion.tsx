import type { FaqItem } from '@/content/faq';
import { buildFaqPageSchema, serializeJsonLd } from '@/lib/schema';
import { cx } from '@/components/ui';

export type FAQAccordionProps = {
  /** The full FAQ set. Pass `topics` to render a subset. */
  items: FaqItem[];
  /**
   * Keeps only the items carrying at least one of these topics. The FAQ runs
   * on three routes and each one wants a different slice of the same 13.
   */
  topics?: string | string[];
  /** Caps the rendered list, for a "top five questions" block on a hub page. */
  limit?: number;
  /** Emits FAQPage JSON-LD for exactly the items that rendered. */
  withSchema?: boolean;
  /** Anchors the JSON-LD node to a route, for example '/keynote/'. */
  schemaPath?: string;
  /** Disambiguates the generated ids when two accordions share a page. */
  idPrefix?: string;
  className?: string;
};

/** Splits a harvested answer on blank lines so multi-paragraph answers keep
 *  their paragraphs instead of running together. */
function paragraphsOf(answer: string): string[] {
  return answer
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/**
 * The carried-over FAQ, on native `<details>`/`<summary>`.
 *
 * Native disclosure means it works with JavaScript switched off, it is
 * keyboard operable without a single key handler, and Find in Page reaches the
 * closed answers in browsers that support it.
 *
 * NOTHING opens by default, and there is no `open` attribute anywhere in this
 * file. The old site shipped an open panel reading "Your Title Goes Here" and
 * a second accordion whose default-open item was completely empty. This
 * component also refuses to render an item with an empty question or an empty
 * answer, so neither defect can come back through the content layer.
 */
export function FAQAccordion({
  items,
  topics,
  limit,
  withSchema = false,
  schemaPath,
  idPrefix = 'faq',
  className,
}: FAQAccordionProps) {
  const wanted = topics === undefined ? undefined : Array.isArray(topics) ? topics : [topics];

  const rendered = items
    .filter((item) => item.question.trim().length > 0 && item.answer.trim().length > 0)
    .filter((item) => (wanted ? item.topics.some((topic) => wanted.includes(topic)) : true))
    .slice(0, limit ?? items.length);

  if (rendered.length === 0) return null;

  return (
    <>
      <div className={cx('dm-faq', className)} data-reveal="stagger">
        {/* No `open` attribute, and no `name` group either: an exclusive
            accordion would close an answer a visitor is still reading. */}
        {rendered.map((item) => (
          <details key={item.id} className="dm-faq__item">
            <summary className="dm-faq__summary" id={`${idPrefix}-${item.id}`}>
              <span className="dm-faq__question">{item.question}</span>
              <span className="dm-faq__marker" aria-hidden="true" />
            </summary>
            <div className="dm-faq__answer dm-prose dm-prose--wide">
              {paragraphsOf(item.answer).map((paragraph, index) => (
                <p key={`${item.id}-p${index}`}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>

      {withSchema ? (
        <script
          type="application/ld+json"
          // JSON-LD has to reach the DOM as a script body. serializeJsonLd
          // escapes <, >, & and the two line separators, so nothing in an
          // answer can close this tag or open another.
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              buildFaqPageSchema(
                rendered.map((item) => ({ question: item.question, answer: item.answer })),
                schemaPath,
              ),
            ),
          }}
        />
      ) : null}
    </>
  );
}

export default FAQAccordion;
