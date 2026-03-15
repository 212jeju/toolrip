---
to: apps/<%= name %>/next.config.ts
---
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/seo', '@repo/ads', '@repo/analytics'],
  output: 'export',
}

export default nextConfig
