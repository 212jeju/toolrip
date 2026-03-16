/* ============================================
   Toolrip — Cloudflare Pages Worker
   Path-based routing:
     toolrip.com/json     → /sites/json-formatter.html
     toolrip.com/bmi      → /sites/bmi-calculator.html
     toolrip.com/about    → /legal/about.html
     toolrip.com/          → /index.html
   ============================================ */

const TOOL_MAP = {
  // Finance (5)
  'mortgage': 'mortgage-calculator',
  'compound-interest': 'compound-interest',
  'tip': 'tip-calculator',
  'salary': 'salary-calculator',
  'percentage': 'percentage-calculator',
  // Health (2)
  'bmi': 'bmi-calculator',
  'calorie': 'calorie-calculator',
  // Developer (3)
  'json': 'json-formatter',
  'base64': 'base64-encoder',
  'uuid': 'uuid-generator',
  // Text (2)
  'word-count': 'word-counter',
  'case': 'case-converter',
  // Conversion (3)
  'hex-rgb': 'hex-rgb-converter',
  'temperature': 'temperature-converter',
  'length': 'length-converter',
  // Security (2)
  'password': 'password-generator',
  'qr': 'qr-code-generator',
  // Math (1)
  'fraction': 'fraction-calculator',
  // DateTime (2)
  'date-diff': 'date-difference',
  'age': 'age-calculator'
};

const LEGAL_PATHS = ['about', 'privacy', 'terms', 'contact'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

    // Root → index.html
    if (!path) {
      return env.ASSETS.fetch(request);
    }

    // Helper: fetch asset, follow Cloudflare's .html-stripping redirects
    async function fetchAsset(assetPath) {
      const assetUrl = new URL(assetPath, url.origin);
      let response = await env.ASSETS.fetch(new Request(assetUrl, request));
      // Cloudflare Pages strips .html and returns 308 — follow it
      if (response.status === 308 || response.status === 301 || response.status === 302) {
        const location = response.headers.get('Location');
        if (location) {
          const redirectUrl = new URL(location, url.origin);
          response = await env.ASSETS.fetch(new Request(redirectUrl, request));
        }
      }
      return response;
    }

    // Legal pages: /about, /privacy, /terms, /contact
    if (LEGAL_PATHS.includes(path)) {
      const response = await fetchAsset(`/legal/${path}.html`);
      if (response.ok) {
        return new Response(response.body, {
          status: 200,
          headers: {
            ...Object.fromEntries(response.headers),
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400'
          }
        });
      }
    }

    // Tool pages: /json, /bmi, /mortgage, etc.
    const slug = TOOL_MAP[path];
    if (slug) {
      const response = await fetchAsset(`/sites/${slug}.html`);
      if (response.ok) {
        return new Response(response.body, {
          status: 200,
          headers: {
            ...Object.fromEntries(response.headers),
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400'
          }
        });
      }
    }

    // Static assets (shared/*, sites/*, etc.) → pass through
    const response = await env.ASSETS.fetch(request);

    // Custom 404 for unknown paths
    if (response.status === 404) {
      const notFoundResp = await fetchAsset('/404.html');
      return new Response(notFoundResp.body, {
        status: 404,
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    return response;
  }
};
