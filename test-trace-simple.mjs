import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3099';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', err => console.log('Page error:', err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Console error:', msg.text());
  });

  try {
    console.log('Navigating to quiz...');
    const response = await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    console.log(`Status: ${response?.status()}`);
    
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: '/tmp/quiz-initial-state.png' });
    console.log('Saved initial state screenshot');

    // Check what's on the page
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText?.slice(0, 300),
        hasButtons: document.querySelectorAll('button').length,
        hasHeadings: document.querySelectorAll('h2').length,
        hasCode: document.querySelectorAll('pre').length,
      };
    });
    console.log('Page content:', pageContent);

    // Try to click "Start Fresh" if it exists
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons`);
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i}: "${text.trim()}"`);
    }

    const startFresh = page.locator('button:has-text("Start Fresh")');
    if (await startFresh.count() > 0) {
      console.log('Found Start Fresh button, clicking...');
      await startFresh.click();
      await page.waitForTimeout(2000);
    }

    // Check for any questions
    for (let i = 0; i < 10; i++) {
      const heading = await page.$eval('h2', el => el.textContent).catch(() => null);
      const hasPre = await page.$('pre') !== null;
      console.log(`Attempt ${i+1}: heading="${heading?.trim()?.slice(0, 40)}", hasCode=${hasPre}`);
      
      if (heading && hasPre) {
        await page.screenshot({ path: `/tmp/trace-attempt-${i+1}.png` });
        console.log(`Saved screenshot to trace-attempt-${i+1}.png`);
      }

      // Try to click any answer button
      const btns = await page.$$('button.rounded-lg');
      if (btns.length > 0) {
        for (const btn of btns) {
          if (await btn.isVisible() && !(await btn.textContent()).includes('Submit')) {
            await btn.click();
            console.log('Clicked an answer');
            break;
          }
        }
      }

      const submitBtn = page.locator('button:has-text("Submit Answer")');
      if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
        await submitBtn.click();
        await page.waitForTimeout(1000);
      }

      const nextBtn = page.locator('button:has-text("Continue"), button:has-text("Next")');
      if (await nextBtn.count() > 0) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
    }

  } catch (error) {
    console.error('Test error:', error);
  }

  await browser.close();
}

run();
