/**
 * Format a Date (or ISO string) into a human-readable string.
 *
 * @param date  - Date object or ISO date string
 * @param locale - BCP 47 locale tag (default "en-US")
 */
export function formatDate(
  date: Date | string,
  locale: string = "en-US"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a number with locale-aware grouping.
 *
 * @param value   - The number to format
 * @param locale  - BCP 47 locale tag (default "en-US")
 * @param options - Intl.NumberFormat options
 */
export function formatNumber(
  value: number,
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Convert a string into a URL-safe slug.
 *
 * @example slugify("Hello World!") // "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
