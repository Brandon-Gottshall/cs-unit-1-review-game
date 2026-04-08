import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:3104/quiz?type=complete_code', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Screenshot: complete_code question with blank
await page.screenshot({ path: '/tmp/blanks-test.png', fullPage: true });

// Check for the styled blank element
const blankEl = await page.$('.syn-blank');
console.log('--- Blank Rendering Test ---');
console.log('Styled blank element found:', !!blankEl);

// Check that we're NOT in JavaCodeEditor (no line-number gutter)
const lineNumbers = await page.$('.line-numbers, [class*="line-num"]');
console.log('Line number gutter (JavaCodeEditor) visible:', !!lineNumbers);

// Check MC options are visible
const options = await page.$$('button');
console.log('Button count:', options.length);

await browser.close();
console.log('--- Done ---');
