import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleGraphic from "@/components/ArticleGraphic";
import PostContent from "@/components/PostContent";
import {
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  getReadingTime,
} from "@/lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Note not found",
      description: "This Daybook field note could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 2);

  return (
    <main id="main-content" className="flex-1">
      <article>
        <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <li>
                <Link
                  href="/blog"
                  className="rounded-sm transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  Field notes
                </Link>
              </li>
              <li aria-hidden="true" className="text-[var(--line-strong)]">
                /
              </li>
              <li className="truncate" aria-current="page">
                {post.topic}
              </li>
            </ol>
          </nav>

          <header className="mx-auto max-w-4xl pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--accent-strong)] uppercase">
              {post.topic}
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.045em] text-balance text-[var(--ink)] sm:text-6xl sm:leading-[1.02]">
              {post.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl font-serif text-xl leading-8 text-[var(--muted)] sm:text-2xl sm:leading-9">
              {post.lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
              <span>
                By{" "}
                <span className="font-semibold text-[var(--ink)]">
                  {post.author}
                </span>
              </span>
              <span aria-hidden="true" className="text-[var(--line-strong)]">
                •
              </span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true" className="text-[var(--line-strong)]">
                •
              </span>
              <span>{getReadingTime(post)}</span>
            </div>
          </header>

          <ArticleGraphic
            alt="An open daybook in green hills, with a completed task becoming a winding path toward a warm sunrise"
            priority
          />

          <div className="mt-16 sm:mt-20">
            <PostContent post={post} />
          </div>
        </div>
      </article>

      <aside
        className="border-t border-[var(--line)] bg-[var(--surface)]"
        aria-labelledby="keep-reading"
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-bold tracking-[0.16em] text-[var(--muted)] uppercase">
            More from the collection
          </p>
          <h2
            id="keep-reading"
            className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]"
          >
            Keep reading
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 transition-[border-color,transform,box-shadow] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_18px_50px_-35px_rgba(26,67,59,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              >
                <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent-strong)] uppercase">
                  {relatedPost.topic}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-semibold leading-7 text-[var(--ink)] transition-colors group-hover:text-[var(--accent-strong)]">
                  {relatedPost.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  {relatedPost.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
