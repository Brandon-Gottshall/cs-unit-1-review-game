import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:3103/quiz?type=write_program', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Screenshot 1: empty editor
await page.screenshot({ path: '/tmp/wp2-empty.png', fullPage: true });

const textarea = await page.$('textarea');
const content = textarea ? await textarea.inputValue() : '';
console.log('--- WriteProgramChallenge v2 ---');
console.log('Editor starts empty:', content.length === 0);
console.log('Placeholder visible:', !!(await page.$('textarea[placeholder]')));

// Type a complete program to trigger fire effect
if (textarea) {
  await textarea.click();
  // Type a valid HelloWorld (matches wp-001 which is the first question)
  await textarea.fill(`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/wp2-fire.png', fullPage: true });

  // Check fire button
  const fireBtn = await page.$('text=🔥');
  console.log('Fire button visible:', !!fireBtn);
}

// Type a class name mismatch to check live warning
if (textarea) {
  await textarea.fill(`public class WrongName {
    public static void main(String[] args) {
        System.out.println("test");
    }
}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/wp2-warning.png', fullPage: true });

  const warning = await page.$('text=doesn\'t match filename');
  console.log('Classname mismatch warning visible:', !!warning);
}

// Check client errors
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.waitForTimeout(500);
console.log('Client errors:', errors.length);

await browser.close();
console.log('--- Done ---');
