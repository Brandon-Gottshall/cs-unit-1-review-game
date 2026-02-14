import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Landing page
const p1 = await context.newPage();
await p1.goto('http://localhost:3099/', { waitUntil: 'networkidle', timeout: 15000 });
await p1.waitForTimeout(2000);
await p1.screenshot({ path: '/tmp/final-landing.png', fullPage: true });
console.log('Landing captured');

// Quiz page (fresh)
const p2 = await context.newPage();
const errors = [];
p2.on('pageerror', err => errors.push(err.message));
await p2.goto('http://localhost:3099/quiz', { waitUntil: 'networkidle', timeout: 15000 });
await p2.waitForTimeout(2000);
await p2.screenshot({ path: '/tmp/final-quiz.png', fullPage: true });
console.log(`Quiz captured (errors: ${errors.length})`);

await browser.close();
