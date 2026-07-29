import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Daybook",
    template: "%s · Daybook",
  },
  description:
    "A calm place to keep track of today—and field notes for thoughtful work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-50 -translate-y-20 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="mt-auto border-t border-[var(--line)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-7 text-xs leading-5 text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>Daybook · Make a little room for what matters.</p>
            <p>Notes for humans working with intelligent tools.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
