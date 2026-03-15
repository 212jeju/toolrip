/** Metadata for <head> tags */
export interface MetaData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image";
  robots?: string;
}

/** JSON-LD structured data */
export interface JsonLdData {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

/** Entry for XML sitemap generation */
export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}
