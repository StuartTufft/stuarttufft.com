// scripts/cv-pdf.js
// Generates cv/stuart-tufft-cv.pdf sized to exact content dimensions (single page).
// Run: npm run pdf

const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Match cv-page max-width so print layout is consistent with PDF output
  await page.setViewport({ width: 960, height: 900 });

  const htmlPath = 'file://' + path.resolve(__dirname, '..', 'cv', 'cv-index.html');

  // networkidle0: waits for Google Fonts + Bootstrap CDN to finish loading
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Switch to print media so @media print CSS applies — measurement must match PDF rendering
  await page.emulateMediaType('print');

  // Measure actual print-mode content height
  const height = await page.evaluate(() => document.documentElement.scrollHeight);

  const outPath = path.resolve(__dirname, '..', 'cv', 'stuart-tufft-cv.pdf');

  await page.pdf({
    path: outPath,
    width: '960px',
    height: height + 'px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log('\nSaved: cv/stuart-tufft-cv.pdf (960x' + height + 'px)\n');
}

main().catch(function (e) {
  console.error('\nPDF generation failed:', e.message, '\n');
  process.exit(1);
});
