/**
 * Schema.org & Meta Tag Diversification
 * - Add HowTo schema to pages with how-to sections
 * - Vary OG/Twitter descriptions from meta description
 * - Add BreadcrumbList schema where missing
 */
const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, '..', 'services.json');
const sitesDir = path.join(__dirname, '..', 'sites');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

let howToAdded = 0;
let breadcrumbAdded = 0;
let ogDiversified = 0;

services.services.forEach((svc, idx) => {
  const filePath = path.join(sitesDir, svc.slug + '.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  const cat = svc.category;
  const name = svc.name;

  // --- 1. Add HowTo schema for every 2nd page (50 pages) ---
  if (idx % 2 === 0 && !html.includes('"@type": "HowTo"') && !html.includes('"@type":"HowTo"')) {
    const howToSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use ${name}",
    "description": "Step-by-step guide to using the free online ${name} on Toolrip.",
    "step": [
      {"@type": "HowToStep", "position": 1, "name": "Open the tool", "text": "Navigate to the ${name} page on Toolrip."},
      {"@type": "HowToStep", "position": 2, "name": "Enter your data", "text": "Input the required values or data into the tool."},
      {"@type": "HowToStep", "position": 3, "name": "Get results", "text": "View the output instantly — no page reload needed."},
      {"@type": "HowToStep", "position": 4, "name": "Copy or export", "text": "Copy your results to clipboard or export as needed."}
    ],
    "totalTime": "PT1M",
    "tool": {"@type": "HowToTool", "name": "Web browser"}
  }
  </script>`;

    // Insert before </head>
    html = html.replace('</head>', howToSchema + '\n</head>');
    howToAdded++;
  }

  // --- 2. Add BreadcrumbList schema where missing ---
  if (!html.includes('BreadcrumbList')) {
    const categoryLabels = {
      finance: 'Finance', health: 'Health', developer: 'Developer',
      text: 'Text', conversion: 'Conversion', security: 'Security',
      math: 'Math', datetime: 'Date & Time', design: 'Design', seo: 'SEO'
    };
    const catLabel = categoryLabels[cat] || 'Tools';

    const breadcrumbSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://toolrip.com"},
      {"@type": "ListItem", "position": 2, "name": "${catLabel} Tools", "item": "https://toolrip.com/#${cat}"},
      {"@type": "ListItem", "position": 3, "name": "${name}", "item": "https://toolrip.com/${svc.route}"}
    ]
  }
  </script>`;

    html = html.replace('</head>', breadcrumbSchema + '\n</head>');
    breadcrumbAdded++;
  }

  // --- 3. Diversify OG/Twitter descriptions ---
  // Make og:description slightly different from meta description
  const metaDescMatch = html.match(/<meta name="description" content="([^"]+)"/);
  if (metaDescMatch) {
    const metaDesc = metaDescMatch[1];

    // Create a shorter OG variant
    const ogDesc = metaDesc.length > 100
      ? metaDesc.substring(0, metaDesc.lastIndexOf('.', 100) + 1) + ` Try ${name} free on Toolrip.`
      : metaDesc + ` Try it free on Toolrip.`;

    // Create an even shorter Twitter variant
    const twitterDesc = metaDesc.length > 80
      ? metaDesc.substring(0, metaDesc.lastIndexOf(' ', 80)) + `... Free on Toolrip.`
      : metaDesc;

    html = html.replace(
      /<meta property="og:description" content="[^"]+"/,
      `<meta property="og:description" content="${ogDesc}"`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]+"/,
      `<meta name="twitter:description" content="${twitterDesc}"`
    );
    ogDiversified++;
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log(`=== Schema/Meta Diversification Complete ===`);
console.log(`  HowTo schema added: ${howToAdded} pages`);
console.log(`  BreadcrumbList added: ${breadcrumbAdded} pages`);
console.log(`  OG/Twitter descriptions diversified: ${ogDiversified} pages`);
