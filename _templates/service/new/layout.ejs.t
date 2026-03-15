---
to: apps/<%= name %>/src/app/layout.tsx
---
import type { ReactNode } from 'react'
import { AdSenseScript } from '@repo/ads'
import { CfAnalytics } from '@repo/analytics'
import './globals.css'

export const metadata = {
  title: '<%= h.inflection.titleize(name) %>',
  description: '<%= description %>',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AdSenseScript publisherId={process.env.NEXT_PUBLIC_ADSENSE_ID ?? ''} />
        <CfAnalytics token={process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN ?? ''} />
      </body>
    </html>
  )
}
