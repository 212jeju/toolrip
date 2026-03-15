/* ============================================
   Toolrip — Cloudflare Pages Worker
   Path-based routing:
     toolrip.com/json     → /sites/json-formatter.html
     toolrip.com/bmi      → /sites/bmi-calculator.html
     toolrip.com/about    → /legal/about.html
     toolrip.com/          → /index.html
   ============================================ */

const TOOL_MAP = {
  'json': 'json-formatter',
  'base64': 'base64-encoder',
  'url-encode': 'url-encoder',
  'regex': 'regex-tester',
  'jwt': 'jwt-decoder',
  'html-entity': 'html-entity-encoder',
  'css-minify': 'css-minifier',
  'js-minify': 'js-minifier',
  'sql': 'sql-formatter',
  'markdown': 'markdown-editor',
  'yaml': 'yaml-to-json',
  'xml': 'xml-formatter',
  'cron': 'cron-generator',
  'uuid': 'uuid-generator',
  'lorem': 'lorem-ipsum',
  'word-count': 'word-counter',
  'case': 'case-converter',
  'diff': 'text-diff',
  'slug': 'slug-generator',
  'dedupe': 'duplicate-remover',
  'binary': 'text-to-binary',
  'rot13': 'rot13-encoder',
  'escape': 'string-escape',
  'lines': 'line-counter',
  'whitespace': 'whitespace-remover',
  'random-string': 'random-string',
  'repeat': 'text-repeater',
  'reverse': 'reverse-text',
  'fancy': 'fancy-text',
  'invisible': 'invisible-character',
  'hex-rgb': 'hex-rgb-converter',
  'timestamp': 'timestamp-converter',
  'number-base': 'number-base-converter',
  'temperature': 'temperature-converter',
  'length': 'length-converter',
  'weight': 'weight-converter',
  'speed': 'speed-converter',
  'data-storage': 'data-storage-converter',
  'angle': 'angle-converter',
  'csv-json': 'csv-to-json',
  'json-csv': 'json-to-csv',
  'img-base64': 'image-to-base64',
  'epoch': 'epoch-converter',
  'roman': 'roman-numeral',
  'ascii-hex': 'ascii-hex-converter',
  'mortgage': 'mortgage-calculator',
  'compound-interest': 'compound-interest',
  'emi': 'emi-calculator',
  'tip': 'tip-calculator',
  'salary': 'salary-calculator',
  'roi': 'roi-calculator',
  'percentage': 'percentage-calculator',
  'sales-tax': 'sales-tax-calculator',
  'currency': 'currency-converter',
  'inflation': 'inflation-calculator',
  'retirement': 'retirement-calculator',
  'break-even': 'break-even-calculator',
  'profit-margin': 'profit-margin',
  'apr': 'apr-calculator',
  'debt-payoff': 'debt-payoff',
  'bmi': 'bmi-calculator',
  'calorie': 'calorie-calculator',
  'body-fat': 'body-fat-calculator',
  'bmr': 'bmr-calculator',
  'macro': 'macro-calculator',
  'ideal-weight': 'ideal-weight',
  'water-intake': 'water-intake',
  'due-date': 'due-date-calculator',
  'ovulation': 'ovulation-calculator',
  'heart-rate': 'heart-rate-zones',
  'running-pace': 'running-pace',
  'sleep': 'sleep-calculator',
  'fraction': 'fraction-calculator',
  'percent': 'percent-calculator',
  'gcf-lcm': 'gcf-lcm-calculator',
  'scientific': 'scientific-notation',
  'matrix': 'matrix-calculator',
  'quadratic': 'quadratic-solver',
  'statistics': 'statistics-calculator',
  'prime': 'prime-checker',
  'pythagorean': 'pythagorean-calculator',
  'area-volume': 'area-volume-calculator',
  'date-diff': 'date-difference',
  'age': 'age-calculator',
  'timezone': 'timezone-converter',
  'timer': 'countdown-timer',
  'week-number': 'week-number',
  'business-days': 'business-days',
  'md5': 'md5-generator',
  'sha256': 'sha256-generator',
  'password': 'password-generator',
  'password-strength': 'password-strength',
  'qr': 'qr-code-generator',
  'bcrypt': 'bcrypt-generator',
  'color-palette': 'color-palette',
  'gradient': 'gradient-generator',
  'box-shadow': 'box-shadow-generator',
  'svg-png': 'svg-to-png',
  'meta-tag': 'meta-tag-generator',
  'og-preview': 'og-preview'
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
