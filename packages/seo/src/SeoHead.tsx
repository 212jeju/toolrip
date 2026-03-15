import type { Metadata } from "./types";

export interface SeoHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  siteName?: string;
  type?: "website" | "article";
  locale?: string;
  noindex?: boolean;
}

/**
 * Generate a Next.js Metadata object from SEO props.
 * Usage in a page/layout:
 *   export const metadata = generateMetadata({ title: "...", description: "..." });
 */
export function generateMetadata(props: SeoHeadProps): Metadata {
  const {
    title,
    description,
    url,
    image,
    siteName,
    type = "website",
    locale = "en_US",
    noindex = false,
  } = props;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      locale,
      ...(url && { url }),
      ...(siteName && { siteName }),
      ...(image && {
        images: [{ url: image }],
      }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image && { images: [image] }),
    },
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };

  return metadata;
}
