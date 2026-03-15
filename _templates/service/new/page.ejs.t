---
to: apps/<%= name %>/src/app/page.tsx
---
import { Container } from '@repo/ui'
import { AdBanner } from '@repo/ads'
import { JsonLd } from '@repo/seo'

export default function HomePage() {
  return (
    <Container>
      <AdBanner slot="top-banner" format="horizontal" />
      <main>
        <h1><%= h.inflection.titleize(name) %></h1>
        <p><%= description %></p>
        {/* TODO: Implement service UI */}
      </main>
      <AdBanner slot="bottom-banner" format="rectangle" />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '<%= h.inflection.titleize(name) %>',
          description: '<%= description %>',
        }}
      />
    </Container>
  )
}
