/**
 * Fix headers and footers that weren't caught by the first script
 * due to whitespace differences
 */
const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, '..', 'services.json');
const sitesDir = path.join(__dirname, '..', 'sites');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const categoryNavLabels = {
  finance: 'Finance Tools', health: 'Health Tools', developer: 'Dev Tools',
  text: 'Text Tools', conversion: 'Converters', security: 'Security Tools',
  math: 'Math Tools', datetime: 'Date &amp; Time', design: 'Design Tools', seo: 'SEO Tools',
};
const categoryHubUrls = {
  finance: 'https://toolrip.com/#finance', health: 'https://toolrip.com/#health',
  developer: 'https://toolrip.com/#developer', text: 'https://toolrip.com/#text',
  conversion: 'https://toolrip.com/#conversion', security: 'https://toolrip.com/#security',
  math: 'https://toolrip.com/#math', datetime: 'https://toolrip.com/#datetime',
  design: 'https://toolrip.com/#design', seo: 'https://toolrip.com/#seo',
};
const categoryPopularTools = {
  finance: [
    { name: 'Mortgage Calculator', url: 'https://toolrip.com/mortgage' },
    { name: 'Compound Interest', url: 'https://toolrip.com/compound-interest' },
    { name: 'ROI Calculator', url: 'https://toolrip.com/roi' },
  ],
  health: [
    { name: 'BMI Calculator', url: 'https://toolrip.com/bmi' },
    { name: 'Calorie Calculator', url: 'https://toolrip.com/calorie' },
    { name: 'BMR Calculator', url: 'https://toolrip.com/bmr' },
  ],
  developer: [
    { name: 'JSON Formatter', url: 'https://toolrip.com/json' },
    { name: 'Base64 Encoder', url: 'https://toolrip.com/base64' },
    { name: 'Regex Tester', url: 'https://toolrip.com/regex' },
  ],
  text: [
    { name: 'Word Counter', url: 'https://toolrip.com/word-count' },
    { name: 'Case Converter', url: 'https://toolrip.com/case' },
    { name: 'Text Diff', url: 'https://toolrip.com/diff' },
  ],
  conversion: [
    { name: 'Hex to RGB', url: 'https://toolrip.com/hex-rgb' },
    { name: 'Temperature', url: 'https://toolrip.com/temperature' },
    { name: 'Timestamp', url: 'https://toolrip.com/timestamp' },
  ],
  security: [
    { name: 'Password Generator', url: 'https://toolrip.com/password' },
    { name: 'QR Code Generator', url: 'https://toolrip.com/qr' },
    { name: 'SHA-256 Hash', url: 'https://toolrip.com/sha256' },
  ],
  math: [
    { name: 'Fraction Calculator', url: 'https://toolrip.com/fraction' },
    { name: 'Statistics Calculator', url: 'https://toolrip.com/statistics' },
    { name: 'Quadratic Solver', url: 'https://toolrip.com/quadratic' },
  ],
  datetime: [
    { name: 'Date Difference', url: 'https://toolrip.com/date-diff' },
    { name: 'Age Calculator', url: 'https://toolrip.com/age' },
    { name: 'Timezone Converter', url: 'https://toolrip.com/timezone' },
  ],
  design: [
    { name: 'Color Palette', url: 'https://toolrip.com/color-palette' },
    { name: 'Gradient Generator', url: 'https://toolrip.com/gradient' },
    { name: 'Box Shadow', url: 'https://toolrip.com/box-shadow' },
  ],
  seo: [
    { name: 'Meta Tag Generator', url: 'https://toolrip.com/meta-tag' },
    { name: 'OG Preview', url: 'https://toolrip.com/og-preview' },
  ],
};

let headerFixed = 0;
let footerFixed = 0;

services.services.forEach((svc) => {
  const filePath = path.join(sitesDir, svc.slug + '.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  const cat = svc.category;
  const catLabel = categoryNavLabels[cat] || 'Tools';
  const catUrl = categoryHubUrls[cat] || 'https://toolrip.com';

  // Check if header already has category nav
  const hasCatNav = Object.values(categoryNavLabels).some(label => html.includes(label));

  if (!hasCatNav) {
    // Use regex to match header regardless of whitespace
    const headerRegex = /(<header class="header">\s*<a href="https:\/\/toolrip\.com" class="logo">Toolrip<\/a>\s*<nav>\s*)<a href="https:\/\/toolrip\.com">Home<\/a>\s*<a href="https:\/\/toolrip\.com\/about">About<\/a>\s*<a href="https:\/\/toolrip\.com\/contact">Contact<\/a>(\s*<\/nav>\s*<\/header>)/;

    if (headerRegex.test(html)) {
      html = html.replace(headerRegex, (match, before, after) => {
        return `${before}<a href="https://toolrip.com">Home</a>\n        <a href="${catUrl}">${catLabel}</a>\n        <a href="https://toolrip.com/about">About</a>\n        <a href="https://toolrip.com/contact">Contact</a>${after}`;
      });
      headerFixed++;
    }
  }

  // Check if footer already has Popular section
  if (!html.includes('Popular:')) {
    const popularTools = (categoryPopularTools[cat] || []).filter(t => !t.url.endsWith('/' + svc.route));

    // Use regex for footer too
    const footerRegex = /(<footer class="footer">\s*<p>\s*)<a href="https:\/\/toolrip\.com">Home<\/a>\s*<a href="https:\/\/toolrip\.com\/about">About<\/a>\s*<a href="https:\/\/toolrip\.com\/privacy">Privacy Policy<\/a>\s*<a href="https:\/\/toolrip\.com\/terms">Terms of Service<\/a>\s*<a href="https:\/\/toolrip\.com\/contact">Contact<\/a>(\s*<\/p>\s*<p class="mt-1">)/;

    if (footerRegex.test(html)) {
      const popularLinksHtml = popularTools.map(t => `      <a href="${t.url}">${t.name}</a>`).join('\n');
      html = html.replace(footerRegex, (match, before, after) => {
        return `${before}<a href="https://toolrip.com">Home</a>\n      <a href="${catUrl}">${catLabel}</a>\n      <a href="https://toolrip.com/about">About</a>\n      <a href="https://toolrip.com/privacy">Privacy Policy</a>\n      <a href="https://toolrip.com/terms">Terms of Service</a>\n      <a href="https://toolrip.com/contact">Contact</a>\n    </p>\n    <p style="margin-top:.5rem;font-size:.75rem">Popular:\n${popularLinksHtml}\n    </p>\n    <p class="mt-1">`;
      });
      footerFixed++;
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log(`Headers fixed: ${headerFixed}`);
console.log(`Footers fixed: ${footerFixed}`);
