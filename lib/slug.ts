/** URL-safe slug for a todo title: lowercase words joined by single dashes. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-/, "");
}
