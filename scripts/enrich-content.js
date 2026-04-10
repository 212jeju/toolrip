/**
 * Content Enrichment Script
 * Adds unique content sections to thin pages to increase content depth
 * and structural diversity. Each page gets a different content type.
 */
const fs = require('fs');
const path = require('path');

const sitesDir = path.join(__dirname, '..', 'sites');

// Each entry: [slug, contentType, content]
// contentType varies to create structural diversity
const enrichments = [
  // ---- TEXT TOOLS ----
  ['lorem-ipsum', 'technical-bg', {
    title: 'The History of Lorem Ipsum',
    paragraphs: [
      'Lorem Ipsum has a fascinating history stretching back over five centuries. The standard passage used today comes from a work by Cicero written in 45 BC, "De Finibus Bonorum et Malorum" (On the Ends of Good and Evil). A scholar named Richard McClintock traced the origins in the 1980s, discovering that the seemingly random Latin text was derived from sections 1.10.32 and 1.10.33 of this philosophical work.',
      'The text was first used as placeholder content by an unknown typesetter in the 1500s, who scrambled sections of Cicero\'s text to create a type specimen book. It survived not only five centuries of manual typesetting but also the leap into electronic typesetting in the 1960s with Letraset sheets, and later into desktop publishing software like Aldus PageMaker in the 1980s.',
      'Modern alternatives to Lorem Ipsum include "Hipster Ipsum," "Bacon Ipsum," and "Cupcake Ipsum," but the original remains the industry standard because its letter distribution and word lengths closely resemble English text, making it ideal for testing visual layouts without distracting readers with meaningful content.'
    ]
  }],
  ['duplicate-remover', 'did-you-know', {
    title: 'Interesting Facts About Data Deduplication',
    facts: [
      'Enterprise storage systems use deduplication to reduce backup sizes by 10x to 50x, saving organizations millions in storage costs annually.',
      'The first patent for data deduplication was filed in 1999 by Quantum Corporation, originally targeting tape backup systems.',
      'Modern email servers use deduplication techniques to handle the fact that the average corporate email attachment is forwarded 4.7 times within an organization.',
      'DNA sequencing labs use text deduplication algorithms similar to this tool to identify repeated genetic sequences across billions of base pairs.'
    ]
  }],
  ['whitespace-remover', 'quick-ref', {
    title: 'Whitespace Characters Reference',
    headers: ['Character', 'Unicode', 'Name', 'Common Source'],
    rows: [
      ['Space', 'U+0020', 'Standard Space', 'Spacebar key'],
      ['Tab', 'U+0009', 'Horizontal Tab', 'Tab key, code indentation'],
      ['NBSP', 'U+00A0', 'Non-Breaking Space', 'HTML &amp;nbsp;, Word docs'],
      ['EM Space', 'U+2003', 'Em Space', 'Typography, PDF exports'],
      ['EN Space', 'U+2002', 'En Space', 'Typography software'],
      ['Zero Width', 'U+200B', 'Zero-Width Space', 'Web copy-paste, Unicode text'],
      ['CRLF', 'U+000D+000A', 'Carriage Return + Line Feed', 'Windows line endings'],
      ['LF', 'U+000A', 'Line Feed', 'Unix/Mac line endings'],
    ]
  }],
  ['text-repeater', 'use-scenarios', {
    title: 'Creative Uses for Text Repetition',
    scenarios: [
      { heading: 'Load Testing & QA', text: 'Generate large text blocks to test input field limits, database column capacities, and UI overflow behavior. QA engineers use repeated text to verify that applications handle maximum-length inputs gracefully without crashing or truncating data.' },
      { heading: 'CSS & Layout Testing', text: 'Designers use repeated text blocks to test how layouts behave with varying content lengths. Repeating paragraphs helps identify text wrapping issues, container overflow problems, and responsive design breakpoints across different screen sizes.' },
      { heading: 'Data Padding & Formatting', text: 'When preparing fixed-width data files or aligning columns in plain text documents, text repetition fills spaces consistently. This is common in legacy system integrations that require fixed-length record formats.' },
    ]
  }],
  ['reverse-text', 'did-you-know', {
    title: 'Fun Facts About Reversed Text',
    facts: [
      'Leonardo da Vinci wrote his personal notebooks entirely in mirror script (reversed text), possibly to keep his ideas private or simply because he was left-handed.',
      'Palindromes — words or phrases that read the same forwards and backwards — exist in every known human language. The longest English palindrome sentence verified is over 17,000 words.',
      'Ambulances display "AMBULANCE" in reverse on their front so drivers can read it correctly in their rear-view mirrors — a practical application of text reversal used worldwide.',
      'The concept of "reverse speech" analysis claims hidden messages exist in speech played backwards, though linguists consider this a form of auditory pareidolia rather than genuine communication.'
    ]
  }],
  // ---- DEVELOPER TOOLS ----
  ['image-to-base64', 'technical-bg', {
    title: 'How Base64 Encoding Works for Images',
    paragraphs: [
      'Base64 encoding converts binary data into a text string using 64 ASCII characters (A-Z, a-z, 0-9, +, /). For images, this means every 3 bytes of raw pixel data become 4 characters of Base64 text, resulting in approximately 33% larger file sizes compared to the original binary format.',
      'When you embed a Base64-encoded image directly in HTML or CSS using a data URI (data:image/png;base64,...), the browser decodes the string back into binary data in memory. This eliminates an HTTP request but increases the initial HTML/CSS payload size. For images under 5KB, this trade-off is generally favorable.',
      'The encoding process works by taking groups of 3 bytes (24 bits), splitting them into 4 groups of 6 bits, and mapping each 6-bit value to one of the 64 characters in the Base64 alphabet. If the input length is not divisible by 3, padding characters (=) are added to the output.'
    ]
  }],
  ['rot13-encoder', 'quick-ref', {
    title: 'Caesar Cipher Shift Reference',
    headers: ['Shift', 'Name', 'A becomes', 'Example'],
    rows: [
      ['ROT1', 'Shift by 1', 'B', 'HELLO → IFMMP'],
      ['ROT5', 'Shift by 5', 'F', 'HELLO → MJQQT'],
      ['ROT13', 'Standard ROT13', 'N', 'HELLO → URYYB'],
      ['ROT18', 'ROT13 + ROT5(digits)', 'N', 'H3LLO → U8YYB'],
      ['ROT25', 'Shift by 25', 'Z', 'HELLO → GDKKN'],
      ['ROT47', 'Full ASCII rotation', '`', 'Uses ASCII 33-126'],
    ]
  }],
  ['sha256-generator', 'technical-bg', {
    title: 'Inside the SHA-256 Algorithm',
    paragraphs: [
      'SHA-256 (Secure Hash Algorithm 256-bit) processes data in 512-bit (64-byte) blocks through 64 rounds of mathematical operations. Each round applies bitwise operations including AND, OR, XOR, right-rotation, and right-shift to transform the internal state. The algorithm maintains eight 32-bit working variables that are initialized with specific fractional parts of the square roots of the first eight prime numbers.',
      'The security of SHA-256 relies on the avalanche effect: changing a single bit in the input produces a completely different hash output, with approximately 50% of the output bits flipping. This makes it computationally infeasible to find two different inputs that produce the same hash (collision resistance) or to reconstruct the original input from a hash (preimage resistance).',
      'SHA-256 is used extensively in Bitcoin mining, where miners must find a nonce value that, when combined with block data and hashed twice with SHA-256, produces a hash below a target threshold. This proof-of-work mechanism requires approximately 4.6 × 10^21 hash computations per second across the entire Bitcoin network as of 2026.'
    ]
  }],
  ['markdown-editor', 'quick-ref', {
    title: 'Markdown Syntax Cheat Sheet',
    headers: ['Element', 'Syntax', 'Output'],
    rows: [
      ['Heading 1', '# Text', 'Large heading'],
      ['Heading 2', '## Text', 'Medium heading'],
      ['Bold', '**text**', 'Bold text'],
      ['Italic', '*text*', 'Italic text'],
      ['Link', '[label](url)', 'Clickable link'],
      ['Image', '![alt](url)', 'Embedded image'],
      ['Code', '`code`', 'Inline code'],
      ['Code Block', '```lang ... ```', 'Highlighted code block'],
      ['List', '- item', 'Bulleted list'],
      ['Numbered', '1. item', 'Numbered list'],
      ['Blockquote', '> text', 'Indented quote'],
      ['Table', '| col | col |', 'Data table'],
      ['Checkbox', '- [x] task', 'Checked task'],
    ]
  }],
  // ---- HEALTH TOOLS ----
  ['heart-rate-zones', 'expert-rec', {
    title: 'Training Recommendations by Zone',
    items: [
      { label: 'Zone 1 (50-60% MHR)', text: 'Recovery and warm-up. Use for active recovery days. Sessions of 30-60 minutes build aerobic base without creating fatigue. Ideal for beginners starting a fitness program.' },
      { label: 'Zone 2 (60-70% MHR)', text: 'Fat burning and endurance. The primary zone for long-distance training. Most marathon training plans call for 80% of weekly mileage in this zone. Conversations should be comfortable.' },
      { label: 'Zone 3 (70-80% MHR)', text: 'Aerobic capacity. Improves cardiovascular efficiency and muscular endurance. Tempo runs and steady-state efforts fall here. You can speak in short sentences but not hold a conversation.' },
      { label: 'Zone 4 (80-90% MHR)', text: 'Lactate threshold. Interval training zone where your body learns to process lactic acid more efficiently. Typical intervals: 3-8 minutes with equal rest. Speaking is limited to a few words.' },
      { label: 'Zone 5 (90-100% MHR)', text: 'Maximum effort and VO2 max. Sprint intervals and race-pace efforts. Sessions should be brief: 30 seconds to 3 minutes with full recovery. Only 5% of weekly training should be in this zone.' },
    ]
  }],
  // ---- CONVERSION TOOLS ----
  ['weight-converter', 'quick-ref', {
    title: 'Weight Unit Conversion Reference',
    headers: ['Unit', 'Equivalent in Grams', 'Common Use'],
    rows: [
      ['Milligram (mg)', '0.001 g', 'Medication dosage, chemistry'],
      ['Gram (g)', '1 g', 'Food nutrition, cooking'],
      ['Kilogram (kg)', '1,000 g', 'Body weight, shipping (metric)'],
      ['Metric Ton', '1,000,000 g', 'Industrial, cargo'],
      ['Ounce (oz)', '28.3495 g', 'Food packaging (US/UK)'],
      ['Pound (lb)', '453.592 g', 'Body weight, shipping (US)'],
      ['Stone', '6,350.29 g', 'Body weight (UK)'],
      ['Short Ton', '907,185 g', 'US industrial'],
      ['Grain', '0.0648 g', 'Ammunition, jewelry'],
      ['Carat', '0.2 g', 'Gemstones'],
    ]
  }],
  ['speed-converter', 'did-you-know', {
    title: 'Surprising Speed Facts',
    facts: [
      'The fastest human-made object is NASA\'s Parker Solar Probe, which reached 635,266 km/h (394,736 mph) in 2024 — fast enough to travel from New York to Tokyo in under 1 minute.',
      'A sneeze travels at about 160 km/h (100 mph), while a cough moves at roughly 80 km/h (50 mph). Both are significantly faster than the average human running speed of 13 km/h.',
      'The speed of sound varies dramatically by medium: 343 m/s in air, 1,480 m/s in water, and approximately 5,960 m/s in steel — meaning sound travels 17 times faster through steel than through air.',
      'Internet data transmitted via fiber optic cables travels at about 200,000 km/s — roughly two-thirds the speed of light in vacuum (299,792 km/s).'
    ]
  }],
  ['data-storage-converter', 'technical-bg', {
    title: 'Binary vs Decimal Storage Units',
    paragraphs: [
      'The confusion between storage units stems from two competing standards. Hard drive manufacturers use decimal (SI) units where 1 GB = 1,000,000,000 bytes (10^9), while operating systems traditionally use binary units where 1 GiB = 1,073,741,824 bytes (2^30). This difference means a "500 GB" hard drive shows as approximately 465 GiB in your operating system.',
      'The IEC introduced binary prefixes in 1998 (KiB, MiB, GiB, TiB) to resolve this ambiguity, but adoption has been slow. Windows still displays binary values with decimal labels (showing "465 GB" instead of "465 GiB"), while macOS switched to decimal units in 2009 with Snow Leopard, making a 500 GB drive show as exactly 500 GB.',
      'At the petabyte scale, the difference becomes substantial: 1 PB (decimal) = 1,000 TB, while 1 PiB (binary) = 1,024 TiB = 1,125.9 TB. Cloud storage providers like AWS bill in binary GiB but market in decimal GB, creating a ~7% discrepancy that can affect cost estimates for large-scale deployments.'
    ]
  }],
  ['temperature-converter', 'quick-ref', {
    title: 'Notable Temperature Reference Points',
    headers: ['Description', 'Celsius', 'Fahrenheit', 'Kelvin'],
    rows: [
      ['Absolute Zero', '-273.15', '-459.67', '0'],
      ['Liquid Nitrogen Boils', '-195.8', '-320.4', '77.4'],
      ['Dry Ice Sublimates', '-78.5', '-109.3', '194.7'],
      ['Water Freezes', '0', '32', '273.15'],
      ['Room Temperature', '20-22', '68-72', '293-295'],
      ['Human Body', '37', '98.6', '310.15'],
      ['Water Boils (sea level)', '100', '212', '373.15'],
      ['Paper Ignites', '233', '451', '506'],
      ['Iron Melts', '1,538', '2,800', '1,811'],
      ['Sun Surface', '5,505', '9,941', '5,778'],
    ]
  }],
  ['number-base-converter', 'quick-ref', {
    title: 'Number Base Quick Reference',
    headers: ['Decimal', 'Binary', 'Octal', 'Hexadecimal'],
    rows: [
      ['0', '0000', '0', '0'],
      ['1', '0001', '1', '1'],
      ['5', '0101', '5', '5'],
      ['8', '1000', '10', '8'],
      ['10', '1010', '12', 'A'],
      ['15', '1111', '17', 'F'],
      ['16', '10000', '20', '10'],
      ['32', '100000', '40', '20'],
      ['64', '1000000', '100', '40'],
      ['128', '10000000', '200', '80'],
      ['255', '11111111', '377', 'FF'],
      ['256', '100000000', '400', '100'],
    ]
  }],
  // ---- DESIGN TOOLS ----
  ['gradient-generator', 'did-you-know', {
    title: 'Fascinating Facts About Color Gradients',
    facts: [
      'CSS gradients were first proposed in 2008 by WebKit developers but weren\'t standardized until CSS3 in 2011. Before that, designers used sliced images or Flash to achieve gradient effects.',
      'The human eye can distinguish approximately 10 million different colors, but gradient perception is non-linear — we notice transitions in darker shades more readily than in lighter ones, which is why perceptual color spaces like OKLCH produce smoother-looking gradients than RGB.',
      'Instagram\'s iconic gradient logo uses 5 color stops (purple, magenta, orange, yellow, and pink) and has become one of the most recognized gradient designs in digital history.',
      'The "gray zone" problem in CSS gradients occurs when complementary colors transition through desaturated middle tones. Modern CSS now supports gradient interpolation in OKLCH color space to avoid muddy midpoints.'
    ]
  }],
  ['color-blindness', 'technical-bg', {
    title: 'The Science of Color Vision Deficiency',
    paragraphs: [
      'Color blindness affects approximately 8% of males and 0.5% of females worldwide, with red-green deficiency (protanopia and deuteranopia) accounting for 99% of all cases. The condition is primarily inherited as an X-linked recessive trait, which explains the gender disparity — males have only one X chromosome, so a single defective gene causes the condition.',
      'The three types of cone cells in the retina — S (short/blue), M (medium/green), and L (long/red) — each contain a different photopigment protein called opsin. Color vision deficiency occurs when one type of cone is absent (dichromacy) or has a shifted sensitivity peak (anomalous trichromacy). In protanomaly, the L-cone peak shifts from 564nm toward the M-cone peak at 534nm.',
      'Web accessibility guidelines (WCAG 2.1) require a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. However, contrast ratios alone don\'t guarantee accessibility for color-blind users — information should never be conveyed by color alone. This simulator helps designers test their color choices against all major types of color vision deficiency.'
    ]
  }],
  // ---- MATH TOOLS ----
  ['matrix-calculator', 'technical-bg', {
    title: 'Applications of Matrix Operations',
    paragraphs: [
      'Matrix multiplication is the computational backbone of modern machine learning. Neural networks perform billions of matrix multiplications during both training and inference — a single forward pass through GPT-4 involves multiplying matrices with billions of parameters. GPU hardware is specifically designed to parallelize these operations, achieving thousands of matrix multiplications simultaneously.',
      'In computer graphics, every 3D transformation — rotation, scaling, translation, and perspective projection — is represented as a 4x4 matrix multiplication. Game engines like Unreal and Unity perform millions of matrix operations per frame to transform vertex positions, calculate lighting, and project 3D scenes onto your 2D screen.',
      'Google\'s PageRank algorithm, which revolutionized web search, is fundamentally a matrix operation. The algorithm models the web as a massive sparse matrix where each entry represents a hyperlink between pages, then repeatedly multiplies a probability vector by this matrix until it converges to the stationary distribution — revealing each page\'s importance.'
    ]
  }],
  // ---- SECURITY TOOLS ----
  ['css-minifier', 'did-you-know', {
    title: 'CSS Optimization Facts',
    facts: [
      'The average website\'s CSS has grown from 15 KB in 2010 to over 80 KB in 2026. Minification typically reduces CSS file size by 15-25%, but combined with gzip compression, total transfer savings can exceed 85%.',
      'Unused CSS is a bigger performance problem than unminified CSS. Studies show that the average website ships 35-50% unused CSS rules, which the browser must still parse and store in memory even if they never match any elements.',
      'CSS parsing blocks rendering — the browser cannot paint pixels until all CSS in the <head> has been downloaded and parsed. This is why CSS is considered "render-blocking" and why minification (reducing parse time) and critical CSS extraction (reducing download size) are both important.',
      'The CSS specification has grown from 68 properties in CSS1 (1996) to over 550 properties in 2026, making modern CSS files significantly more complex and benefiting more from intelligent minification that understands shorthand properties.'
    ]
  }],
  ['url-encoder', 'quick-ref', {
    title: 'URL Encoding Reference for Special Characters',
    headers: ['Character', 'Encoded', 'Usage Context'],
    rows: [
      ['Space', '%20 or +', 'Query parameters, form data'],
      ['!', '%21', 'Required in some API parameters'],
      ['#', '%23', 'Fragment identifiers, hex colors in URLs'],
      ['$', '%24', 'Currency values in parameters'],
      ['&', '%26', 'Separating query parameters'],
      ['+', '%2B', 'Math expressions, phone numbers'],
      ['/', '%2F', 'Path segments when literal slash needed'],
      ['=', '%3D', 'Separating key-value pairs'],
      ['?', '%3F', 'Start of query string when literal needed'],
      ['@', '%40', 'Email addresses in URLs'],
      ['%', '%25', 'The percent sign itself (must be escaped)'],
    ]
  }],
  ['slug-generator', 'use-scenarios', {
    title: 'Where URL Slugs Matter Most',
    scenarios: [
      { heading: 'Blog & CMS Platforms', text: 'WordPress, Ghost, and other content management systems generate slugs from post titles. A well-crafted slug like "/how-to-learn-python" outperforms auto-generated alternatives like "/post-12847" in search rankings because search engines use URL keywords as a ranking signal.' },
      { heading: 'E-commerce Product Pages', text: 'Online stores benefit from descriptive slugs like "/organic-cotton-t-shirt-blue" rather than "/product?id=SKU-4829". Descriptive URLs increase click-through rates from search results by 25% according to Backlinko studies, as users can preview content before clicking.' },
      { heading: 'API Endpoint Design', text: 'RESTful APIs use slugs for resource identification. A slug-based endpoint like "/api/users/john-doe" is more readable and debuggable than "/api/users/a3f9c2e1", making API documentation clearer and reducing support tickets from developers integrating with your service.' },
    ]
  }],
  ['case-converter', 'quick-ref', {
    title: 'Text Case Naming Conventions',
    headers: ['Case Style', 'Example', 'Used In'],
    rows: [
      ['camelCase', 'myVariableName', 'JavaScript, Java variables'],
      ['PascalCase', 'MyClassName', 'C#, TypeScript classes'],
      ['snake_case', 'my_variable_name', 'Python, Ruby, databases'],
      ['SCREAMING_SNAKE', 'MAX_RETRY_COUNT', 'Constants in most languages'],
      ['kebab-case', 'my-component-name', 'CSS classes, URLs, filenames'],
      ['UPPER CASE', 'MY TEXT HERE', 'Headings, emphasis'],
      ['lower case', 'my text here', 'General text normalization'],
      ['Title Case', 'My Article Title', 'Headlines, book titles'],
      ['Sentence case', 'My first sentence', 'Body text, UI labels'],
      ['dot.case', 'my.config.value', 'Configuration keys, Java packages'],
    ]
  }],
  ['text-diff', 'technical-bg', {
    title: 'How Diff Algorithms Work',
    paragraphs: [
      'The most widely used diff algorithm is the Myers diff algorithm, published by Eugene Myers in 1986. It finds the shortest edit script (SES) — the minimum number of insertions and deletions needed to transform one text into another. The algorithm works by exploring an "edit graph" where horizontal moves represent deletions, vertical moves represent insertions, and diagonal moves represent unchanged characters.',
      'Git uses a variation of the Myers algorithm with a patience diff optimization for code files. Patience diff first identifies unique lines that appear exactly once in both files, uses these as anchors, and then applies the standard diff algorithm between anchor points. This produces more intuitive diffs for code because function boundaries and structural elements serve as natural anchors.',
      'The computational complexity of the Myers diff algorithm is O(ND) where N is the total length of both inputs and D is the number of differences. For files that are mostly similar (small D), this is nearly linear. For completely different files, it degrades to O(N^2), which is why diffing two large unrelated files can be noticeably slow.'
    ]
  }],
  ['aspect-ratio', 'quick-ref', {
    title: 'Common Aspect Ratios Reference',
    headers: ['Ratio', 'Decimal', 'Common Use'],
    rows: [
      ['1:1', '1.000', 'Instagram posts, profile pictures'],
      ['4:3', '1.333', 'Traditional TV, iPad, presentations'],
      ['3:2', '1.500', 'DSLR photos, Surface tablets'],
      ['16:9', '1.778', 'HDTV, YouTube, most monitors'],
      ['16:10', '1.600', 'MacBook, widescreen laptops'],
      ['21:9', '2.333', 'Ultrawide monitors, cinema'],
      ['9:16', '0.563', 'TikTok, Instagram Reels, Stories'],
      ['2:3', '0.667', 'Portrait photography, book covers'],
      ['4:5', '0.800', 'Instagram portrait posts'],
      ['1.85:1', '1.850', 'Standard US cinema widescreen'],
      ['2.39:1', '2.390', 'Anamorphic widescreen cinema'],
    ]
  }],
];

// ============================================================
// HTML generators for each content type
// ============================================================

function generateTechnicalBg(data) {
  const paras = data.paragraphs.map(p => `    <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1rem;font-size:.9375rem">${p}</p>`).join('\n');
  return `
  <!-- Technical Background -->
  <section class="mt-4">
    <h2>${data.title}</h2>
${paras}
  </section>`;
}

function generateDidYouKnow(data) {
  const facts = data.facts.map((f, i) => `    <li style="padding:var(--sp-2) 0;border-bottom:1px solid var(--border);color:var(--text-muted);line-height:1.7;font-size:.9375rem">${f}</li>`).join('\n');
  return `
  <!-- Did You Know -->
  <section class="mt-4">
    <h2>${data.title}</h2>
    <ul style="list-style:none;padding:0">
${facts}
    </ul>
  </section>`;
}

function generateQuickRef(data) {
  const headerRow = data.headers.map(h => `<th>${h}</th>`).join('');
  const bodyRows = data.rows.map(row =>
    '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
  ).join('\n      ');
  return `
  <!-- Quick Reference -->
  <section class="mt-4">
    <h2>${data.title}</h2>
    <div style="overflow-x:auto">
    <table class="comparison-table">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>
      ${bodyRows}
      </tbody>
    </table>
    </div>
  </section>`;
}

function generateUseScenarios(data) {
  const cards = data.scenarios.map(s => `    <div class="use-case-card">
      <h3>${s.heading}</h3>
      <p>${s.text}</p>
    </div>`).join('\n');
  return `
  <!-- Use Scenarios -->
  <section class="use-case-section">
    <h2>${data.title}</h2>
    <div class="use-case-cards">
${cards}
    </div>
  </section>`;
}

function generateExpertRec(data) {
  const items = data.items.map(item => `    <div style="margin-bottom:var(--sp-3);padding:var(--sp-3) var(--sp-4);background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius)">
      <h3 style="font-size:.9375rem;margin-bottom:var(--sp-2);color:var(--accent)">${item.label}</h3>
      <p style="font-size:.875rem;color:var(--text-muted);line-height:1.7;margin:0">${item.text}</p>
    </div>`).join('\n');
  return `
  <!-- Expert Recommendations -->
  <section class="mt-4">
    <h2>${data.title}</h2>
${items}
  </section>`;
}

const generators = {
  'technical-bg': generateTechnicalBg,
  'did-you-know': generateDidYouKnow,
  'quick-ref': generateQuickRef,
  'use-scenarios': generateUseScenarios,
  'expert-rec': generateExpertRec,
};

// ============================================================
// Apply enrichments
// ============================================================

let enriched = 0;

enrichments.forEach(([slug, contentType, data]) => {
  const filePath = path.join(sitesDir, slug + '.html');
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${slug}.html not found`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const generator = generators[contentType];
  if (!generator) {
    console.log(`  SKIP: Unknown content type ${contentType}`);
    return;
  }

  const newSection = generator(data);

  // Insert before the footer
  const footerIdx = html.lastIndexOf('<footer class="footer">');
  if (footerIdx === -1) {
    console.log(`  SKIP: ${slug}.html - no footer found`);
    return;
  }

  // Find the credibility footer or sidebar before the main footer
  const credIdx = html.lastIndexOf('<div class="credibility-footer">', footerIdx);
  const sidebarIdx = html.lastIndexOf('<aside class="sidebar">', footerIdx);

  // Insert before credibility footer, sidebar, or main footer (whichever comes first)
  let insertIdx = footerIdx;
  if (credIdx > 0 && credIdx < insertIdx) insertIdx = credIdx;
  if (sidebarIdx > 0 && sidebarIdx < insertIdx) insertIdx = sidebarIdx;

  html = html.substring(0, insertIdx) + newSection + '\n\n  ' + html.substring(insertIdx);

  fs.writeFileSync(filePath, html, 'utf8');
  enriched++;
  console.log(`  OK: ${slug}.html (+${contentType})`);
});

console.log(`\n=== Content Enrichment Complete ===`);
console.log(`Enriched: ${enriched} pages`);
