import puppeteer from 'puppeteer';
const BASE = 'http://localhost:3860';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

// Landing page
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 15000 });
await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-landing.png' });
console.log('✅ landing');

// Quiz page
await page.goto(BASE + '/quiz', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-quiz.png' });
console.log('✅ quiz');

// Scroll quiz page
await page.evaluate(() => window.scrollBy(0, 400));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-quiz-scroll.png' });
console.log('✅ quiz-scrolled');

await browser.close();
