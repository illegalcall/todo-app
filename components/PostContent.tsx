import type { BlogPost, PostBlock } from "@/lib/posts";

function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ContentBlock({ block }: { block: PostBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-[1.0625rem] leading-8 text-[var(--article-copy)]">
        {block.text}
      </p>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-10 border-l-2 border-[var(--warm)] pl-6 font-serif text-2xl leading-9 text-[var(--ink)] italic sm:pl-8 sm:text-[1.7rem]">
        <p>{block.text}</p>
      </blockquote>
    );
  }

  if (block.type === "code") {
    return (
      <figure className="my-8 overflow-hidden rounded-2xl border border-[var(--code-line)] bg-[var(--code-bg)] shadow-sm">
        {block.caption && (
          <figcaption className="border-b border-[var(--code-line)] px-5 py-3 text-xs font-semibold tracking-wide text-[var(--code-muted)] uppercase">
            {block.caption}
          </figcaption>
        )}
        <pre className="overflow-x-auto p-5 text-sm leading-7 text-[var(--code-copy)] sm:p-6">
          <code className="font-mono" data-language={block.language}>
            {block.code}
          </code>
        </pre>
      </figure>
    );
  }

  if (block.ordered) {
    return (
      <ol className="my-7 list-decimal space-y-3 pl-6 text-[1.0625rem] leading-8 text-[var(--article-copy)]">
        {block.items.map((item) => (
          <li key={item} className="pl-1">
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="my-7 list-disc space-y-3 pl-6 text-[1.0625rem] leading-8 text-[var(--article-copy)] marker:text-[var(--accent)]">
      {block.items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PostContent({ post }: { post: BlogPost }) {
  return (
    <div className="lg:grid lg:grid-cols-[12rem_minmax(0,42rem)] lg:justify-center lg:gap-12">
      <aside className="mb-12 border-y border-[var(--line)] py-6 lg:sticky lg:top-8 lg:mb-0 lg:self-start lg:border-y-0 lg:py-1">
        <h2 className="text-xs font-bold tracking-[0.16em] text-[var(--muted)] uppercase">
          In this note
        </h2>
        <nav className="mt-4" aria-label="Article contents">
          <ol className="space-y-3 border-l border-[var(--line-strong)] pl-4 text-sm leading-5">
            {post.sections.map((section) => (
              <li key={section.heading}>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <div>
        {post.sections.map((section, index) => (
          <section
            key={section.heading}
            aria-labelledby={headingId(section.heading)}
            className={index === 0 ? "" : "mt-14"}
          >
            <h2
              id={headingId(section.heading)}
              className="scroll-mt-8 font-serif text-3xl font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-[2.15rem]"
            >
              {section.heading}
            </h2>
            <div className="mt-6 space-y-6">
              {section.blocks.map((block, blockIndex) => (
                <ContentBlock
                  key={`${section.heading}-${block.type}-${blockIndex}`}
                  block={block}
                />
              ))}
            </div>
          </section>
        ))}

        <section
          className="mt-16 border-t border-[var(--line)] pt-8"
          aria-labelledby="sources-heading"
        >
          <h2
            id="sources-heading"
            className="font-serif text-2xl font-semibold text-[var(--ink)]"
          >
            Sources &amp; further reading
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6">
            {post.sources.map((source) => (
              <li key={source.url} className="flex gap-3">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--warm)]"
                  aria-hidden="true"
                />
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent-strong)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--accent-strong)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {source.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
