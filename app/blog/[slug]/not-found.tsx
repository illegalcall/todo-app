import Link from "next/link";

export default function PostNotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-5 py-20 text-center"
    >
      <p className="text-xs font-bold tracking-[0.2em] text-[var(--accent-strong)] uppercase">
        Page missing
      </p>
      <h1 className="mt-4 font-serif text-5xl font-semibold text-[var(--ink)]">
        This note wandered off.
      </h1>
      <p className="mt-5 text-base leading-7 text-[var(--muted)]">
        The field note you requested does not exist, but the rest of the
        collection is right where you left it.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[var(--button-bg)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--button-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        Browse field notes
      </Link>
    </main>
  );
}
