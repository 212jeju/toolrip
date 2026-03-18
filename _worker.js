/* ============================================
   Toolrip — Cloudflare Pages Worker
   Path-based routing:
     toolrip.com/json     → /sites/json-formatter.html
     toolrip.com/bmi      → /sites/bmi-calculator.html
     toolrip.com/about    → /legal/about.html
     toolrip.com/          → /index.html
   ============================================ */

const TOOL_MAP = {
  // Finance (15)
  'mortgage': 'mortgage-calculator',
  'compound-interest': 'compound-interest',
  'tip': 'tip-calculator',
  'salary': 'salary-calculator',
  'percentage': 'percentage-calculator',
  'emi': 'emi-calculator',
  'roi': 'roi-calculator',
  'sales-tax': 'sales-tax-calculator',
  'inflation': 'inflation-calculator',
  'retirement': 'retirement-calculator',
  'break-even': 'break-even-calculator',
  'profit-margin': 'profit-margin',
  'apr': 'apr-calculator',
  'debt-payoff': 'debt-payoff',
  'loan-compare': 'loan-comparison',
  // Health (11)
  'bmi': 'bmi-calculator',
  'calorie': 'calorie-calculator',
  'bmr': 'bmr-calculator',
  'body-fat': 'body-fat-calculator',
  'macro': 'macro-calculator',
  'ideal-weight': 'ideal-weight',
  'water-intake': 'water-intake',
  'running-pace': 'running-pace',
  'heart-rate': 'heart-rate-zones',
  'due-date': 'due-date-calculator',
  'sleep': 'sleep-calculator',
  // Developer (20)
  'json': 'json-formatter',
  'base64': 'base64-encoder',
  'uuid': 'uuid-generator',
  'regex': 'regex-tester',
  'css-minify': 'css-minifier',
  'js-minify': 'js-minifier',
  'sql': 'sql-formatter',
  'markdown': 'markdown-editor',
  'html-entity': 'html-entity-encoder',
  'jwt': 'jwt-decoder',
  'yaml': 'yaml-to-json',
  'cron': 'cron-generator',
  'csv-json': 'csv-to-json',
  'json-csv': 'json-to-csv',
  'xml': 'xml-formatter',
  'img-base64': 'image-to-base64',
  'escape': 'string-escape',
  'url-encode': 'url-encoder',
  'ascii-hex': 'ascii-hex-converter',
  'ip': 'ip-lookup',
  // Text (12)
  'word-count': 'word-counter',
  'case': 'case-converter',
  'lorem': 'lorem-ipsum',
  'slug': 'slug-generator',
  'diff': 'text-diff',
  'dedupe': 'duplicate-remover',
  'binary': 'text-to-binary',
  'lines': 'line-counter',
  'whitespace': 'whitespace-remover',
  'reverse': 'reverse-text',
  'repeat': 'text-repeater',
  'random-string': 'random-string',
  // Conversion (10)
  'hex-rgb': 'hex-rgb-converter',
  'temperature': 'temperature-converter',
  'length': 'length-converter',
  'weight': 'weight-converter',
  'speed': 'speed-converter',
  'data-storage': 'data-storage-converter',
  'angle': 'angle-converter',
  'timestamp': 'timestamp-converter',
  'number-base': 'number-base-converter',
  'roman': 'roman-numeral',
  // Security (7)
  'password': 'password-generator',
  'qr': 'qr-code-generator',
  'md5': 'md5-generator',
  'sha256': 'sha256-generator',
  'password-strength': 'password-strength',
  'rot13': 'rot13-encoder',
  'bcrypt': 'bcrypt-generator',
  // Math (9)
  'fraction': 'fraction-calculator',
  'statistics': 'statistics-calculator',
  'gcf-lcm': 'gcf-lcm-calculator',
  'prime': 'prime-checker',
  'quadratic': 'quadratic-solver',
  'pythagorean': 'pythagorean-calculator',
  'area-volume': 'area-volume-calculator',
  'scientific': 'scientific-notation',
  'matrix': 'matrix-calculator',
  // DateTime (8)
  'date-diff': 'date-difference',
  'age': 'age-calculator',
  'timezone': 'timezone-converter',
  'countdown': 'countdown-timer',
  'epoch': 'epoch-converter',
  'week-number': 'week-number',
  'business-days': 'business-days',
  'pomodoro': 'pomodoro-timer',
  // Design (6)
  'color-palette': 'color-palette',
  'gradient': 'gradient-generator',
  'box-shadow': 'box-shadow-generator',
  'svg-png': 'svg-to-png',
  'color-blind': 'color-blindness',
  'aspect-ratio': 'aspect-ratio',
  // SEO (2)
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
