import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[color:var(--surface-translucent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2.5 rounded-md text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          aria-label="Daybook home"
        >
          <svg
            viewBox="0 0 32 32"
            className="size-8"
            aria-hidden="true"
          >
            <path
              d="M5 9.5c3.7-2 7.4-2 11 .1v17.2c-3.6-2.1-7.3-2.1-11-.1V9.5Z"
              fill="#fffdf7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M16 9.6c3.6-2.1 7.3-2.1 11-.1v17.2c-3.7-2-7.4-2-11 .1V9.6Z"
              fill="#f0e8d7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="23.5" cy="6.5" r="3.5" fill="#eea56e" />
            <path
              d="m8.3 17 2.2 2.2 4.1-5"
              fill="none"
              stroke="#3d7568"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-serif text-xl font-semibold tracking-[-0.02em]">
            Daybook
          </span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-1 text-sm font-medium">
            <li>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Today
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Field notes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
