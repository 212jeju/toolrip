/**
 * Simplified Metadata type compatible with Next.js Metadata API.
 * This avoids importing next directly in this shared package.
 */
export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface Metadata {
  title?: string;
  description?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    type?: string;
    locale?: string;
    images?: OpenGraphImage[];
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    title?: string;
    description?: string;
    images?: string[];
  };
}
