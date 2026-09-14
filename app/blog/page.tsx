import type { Metadata } from "next";
import Link from "next/link";
import ArticleGraphic from "@/components/ArticleGraphic";
import {
  formatPostDate,
  getAllPosts,
  getReadingTime,
} from "@/lib/posts";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "Thoughtful, practical essays from Daybook on AI systems, agents, and the future of building software.",
};

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <main id="main-content" className="flex-1">
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:py-24">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--accent-strong)] uppercase">
              Daybook field notes
            </p>
            <h1 className="mt-5 max-w-xl font-serif text-5xl font-semibold tracking-[-0.045em] text-balance text-[var(--ink)] sm:text-6xl lg:text-7xl">
              Ideas for calmer, more capable work.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">
              Carefully researched essays about artificial intelligence,
              thoughtful systems, and the craft of building tools people can
              trust.
            </p>
          </div>
          <ArticleGraphic
            alt="An open daybook in green hills, with a checked task forming a path toward the morning sun"
            priority
          />
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="latest-notes"
      >
        <div className="flex items-end justify-between gap-6 border-b border-[var(--line)] pb-5">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--muted)] uppercase">
              The collection
            </p>
            <h2
              id="latest-notes"
              className="mt-2 font-serif text-3xl font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-4xl"
            >
              Latest notes
            </h2>
          </div>
          <p className="hidden text-sm text-[var(--muted)] sm:block">
            {allPosts.length} essays · updated thoughtfully
          </p>
        </div>

        <ol className="divide-y divide-[var(--line)]">
          {allPosts.map((post, index) => (
            <li key={post.slug}>
              <article className="group grid gap-5 py-9 sm:grid-cols-[5rem_1fr] sm:gap-7 sm:py-11">
                <div className="font-serif text-4xl text-[var(--line-strong)] transition-colors group-hover:text-[var(--warm)]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
                    <span className="text-[var(--accent-strong)]">
                      {post.topic}
                    </span>
                    <span aria-hidden="true">/</span>
                    <time dateTime={post.date}>
                      {formatPostDate(post.date)}
                    </time>
                    <span aria-hidden="true">/</span>
                    <span>{getReadingTime(post)}</span>
                  </div>

                  <h3 className="mt-4 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-[2.35rem] sm:leading-[1.08]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="rounded-sm transition-colors group-hover:text-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-5">
                    <p className="text-sm text-[var(--muted)]">
                      By{" "}
                      <span className="font-semibold text-[var(--ink)]">
                        {post.author}
                      </span>
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`Read ${post.title}`}
                      className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-[var(--accent-strong)] transition-[gap] group-hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                    >
                      Read note <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
