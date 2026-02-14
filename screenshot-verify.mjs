import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Screenshot 1: Landing page
const page1 = await context.newPage();
await page1.goto('http://localhost:3099/', { waitUntil: 'networkidle', timeout: 15000 });
await page1.waitForTimeout(2000);
await page1.screenshot({ path: '/tmp/landing-expanded.png', fullPage: true });

const landingText = await page1.textContent('body');
const qMatch = landingText.match(/(\d+)\s*Questions/i);
console.log(`Landing: ${qMatch ? qMatch[1] + ' questions' : 'count not found'}`);

// Screenshot 2: Quiz page (new context = clean localStorage)
const page2 = await context.newPage();

const errors = [];
page2.on('pageerror', err => errors.push(err.message));

await page2.goto('http://localhost:3099/quiz', { waitUntil: 'networkidle', timeout: 15000 });
await page2.waitForTimeout(3000);
await page2.screenshot({ path: '/tmp/quiz-expanded.png', fullPage: true });

const bodyText = await page2.textContent('body');
if (bodyText.includes('Application error')) {
  console.log('ERROR: Client-side exception on quiz page');
  console.log('Page errors:', errors);
} else {
  const masteredMatch = bodyText.match(/(\d+)\s*\/\s*(\d+)\s*mastered/);
  console.log(`Quiz pool: ${masteredMatch ? masteredMatch[2] + ' total' : 'not found'}`);

  const badge = await page2.$eval('[class*="gap-1.5"]', el => el.textContent).catch(() => 'none');
  const question = await page2.$eval('h2', el => el.textContent).catch(() => 'none');
  console.log(`Current: [${badge.trim()}] ${question.slice(0, 80)}`);
}

await browser.close();
