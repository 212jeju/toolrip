export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

/**
 * Generate a sitemap.xml string from an array of entries.
 */
export function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString().split("T")[0] : entry.lastModified}</lastmod>`
        : "";
      const changefreq = entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : "";
      const priority =
        entry.priority !== undefined
          ? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
          : "";

      return `  <url>\n    <loc>${entry.url}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Create a sitemap entry with sensible defaults.
 */
export function createSitemapEntry(
  url: string,
  options?: Omit<SitemapEntry, "url">
): SitemapEntry {
  return {
    url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
    ...options,
  };
}
