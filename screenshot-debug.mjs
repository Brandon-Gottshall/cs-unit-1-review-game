import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleMessages = [];
page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => consoleMessages.push(`[PAGE ERROR] ${err.message}`));

await page.goto('http://localhost:3099/quiz', { waitUntil: 'networkidle', timeout: 15000 });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

console.log('=== Console messages ===');
for (const msg of consoleMessages) {
  console.log(msg);
}
