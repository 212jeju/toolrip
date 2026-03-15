---
to: apps/<%= name %>/package.json
---
{
  "name": "<%= name %>",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@repo/ui": "workspace:*",
    "@repo/seo": "workspace:*",
    "@repo/ads": "workspace:*",
    "@repo/analytics": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "vitest": "^3.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
