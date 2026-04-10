/**
 * Additional H2 diversification for Sources and Use Cases sections
 */
const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, '..', 'services.json');
const sitesDir = path.join(__dirname, '..', 'sites');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const sourcesH2 = [
  'Sources &amp; References',
  'References &amp; Further Reading',
  'Trusted Sources',
  'Learn More',
  'Citations &amp; Resources',
];

const useCasesH2 = [
  'Real-World Use Cases',
  'Who Uses This Tool',
  'Practical Applications',
  'Common Scenarios',
  'When to Use This',
  'Use Cases &amp; Examples',
];

const howCompares = [
  'How This Compares',
  'Feature Comparison',
  'Side-by-Side Comparison',
  'Comparison Overview',
];

let processed = 0;

services.services.forEach((svc, idx) => {
  const filePath = path.join(sitesDir, svc.slug + '.html');
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  // Diversify Sources
  const srcH2 = sourcesH2[idx % sourcesH2.length];
  html = html.replace(/<h2>Sources &amp; References<\/h2>/g, `<h2>${srcH2}</h2>`);
  html = html.replace(/<h2>Sources & References<\/h2>/g, `<h2>${srcH2.replace(/&amp;/g, '&')}</h2>`);

  // Diversify Use Cases
  const ucH2 = useCasesH2[idx % useCasesH2.length];
  html = html.replace(/<h2>Real-World Use Cases<\/h2>/g, `<h2>${ucH2}</h2>`);

  // Diversify Who Uses This Tool
  if (html.includes('<h2>Who Uses This Tool</h2>')) {
    const whoH2 = useCasesH2[(idx + 2) % useCasesH2.length];
    html = html.replace(/<h2>Who Uses This Tool<\/h2>/, `<h2>${whoH2}</h2>`);
  }

  // Diversify How This Compares
  const cmpH2 = howCompares[idx % howCompares.length];
  html = html.replace(/<h2>How This Compares<\/h2>/g, `<h2>${cmpH2}</h2>`);

  fs.writeFileSync(filePath, html, 'utf8');
  processed++;
});

console.log(`Processed ${processed} files - additional H2 diversification complete`);
