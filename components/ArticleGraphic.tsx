import Image from "next/image";

interface ArticleGraphicProps {
  alt: string;
  priority?: boolean;
}

export default function ArticleGraphic({
  alt,
  priority = false,
}: ArticleGraphicProps) {
  return (
    <figure>
      <div className="overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_-42px_rgba(26,67,59,0.55)]">
        <Image
          src="/daybook-field-notes.svg"
          alt={alt}
          width={1200}
          height={630}
          sizes="(max-width: 768px) 100vw, 960px"
          priority={priority}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-xs leading-5 text-[var(--muted)]">
        A checked intention becomes a path—an original illustration for Daybook.
      </figcaption>
    </figure>
  );
}
