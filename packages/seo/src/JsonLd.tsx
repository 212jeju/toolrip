export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD script tag for schema.org structured data.
 * Place in your page or layout to add structured data.
 *
 * Example:
 *   <JsonLd data={{
 *     "@context": "https://schema.org",
 *     "@type": "Organization",
 *     name: "My Company",
 *     url: "https://example.com",
 *   }} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
