import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3099';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  // Go to quiz
  console.log('Loading quiz page...');
  await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);

  // Handle resume prompt
  const startFresh = page.locator('button').filter({ hasText: 'Start Fresh' });
  if (await startFresh.count() > 0) {
    console.log('Clicking Start Fresh...');
    await startFresh.click();
    await page.waitForTimeout(1000);
  }

  // Click through questions until we find a trace question
  let foundTrace = false;
  for (let i = 0; i < 150; i++) {
    // Get the question text
    const question = await page.$eval('h2', el => el.textContent?.trim()).catch(() => '');
    
    // Look for the VariableTraceViz component by checking for pre.font-mono which is part of it
    const codeBlockExists = await page.$('pre.font-mono') !== null;
    
    // Get all visible badge-like elements
    const typeInfo = await page.evaluate(() => {
      const span = document.querySelector('[class*="gap-1.5"] span');
      if (span) return span.textContent?.trim();
      return 'Unknown';
    });

    console.log(`Q${i+1}: [${typeInfo}] ${question?.slice(0, 50) || 'Loading...'}`);

    if (codeBlockExists) {
      // Check if this looks like a trace question by looking for the specific structure
      const isTraceQuestion = await page.evaluate(() => {
        const prompt = document.evaluate(
          "//text()[contains(., 'variable')]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return !!prompt;
      });

      if (isTraceQuestion) {
        console.log('FOUND TRACE QUESTION (has code block and variable context)!');
        await page.screenshot({ path: '/tmp/trace-question-before-answer.png' });

        // Get the code
        const codeBlock = await page.$('pre.font-mono');
        if (codeBlock) {
          const codeText = await codeBlock.textContent();
          console.log('Code to trace:');
          console.log(codeText);
        }

        // Get MC options
        const mcButtons = await page.$$('button.rounded-lg');
        const visibleMC = [];
        for (const btn of mcButtons) {
          if (await btn.isVisible()) {
            const text = await btn.textContent();
            if (text.trim().length > 0 && !text.includes('Submit')) {
              visibleMC.push(text.trim());
            }
          }
        }
        console.log(`MC options: ${visibleMC.length}`);
        visibleMC.forEach((opt, idx) => console.log(`  ${idx+1}. ${opt}`));

        // Click first option
        if (visibleMC.length > 0) {
          await page.click('button.rounded-lg');
          await page.waitForTimeout(500);
          
          const submitBtn = page.locator('button').filter({ hasText: 'Submit Answer' });
          if (await submitBtn.count() > 0) {
            await submitBtn.click();
            await page.waitForTimeout(1200);
            await page.screenshot({ path: '/tmp/trace-question-after-answer.png' });
            console.log('Captured feedback screenshot');
          }
        }

        foundTrace = true;
        break;
      }
    }

    // Auto-answer to next question
    const btns = await page.$$('button.rounded-lg');
    let clicked = false;
    for (const btn of btns) {
      if (await btn.isVisible() && await btn.isEnabled()) {
        const text = await btn.textContent();
        if (text.trim().length > 0 && !text.includes('Submit')) {
          await btn.click();
          clicked = true;
          break;
        }
      }
    }

    if (!clicked) {
      const noIdea = page.locator('button').filter({ hasText: 'I have no idea' });
      if (await noIdea.count() > 0) {
        await noIdea.click();
        await page.waitForTimeout(300);
        const showMe = page.locator('button').filter({ hasText: 'Yes, show me' });
        if (await showMe.count() > 0) {
          await showMe.click();
          await page.waitForTimeout(300);
        }
      }
    }

    await page.waitForTimeout(200);
    
    const submitBtn = page.locator('button').filter({ hasText: 'Submit Answer' });
    if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
      await submitBtn.click();
      await page.waitForTimeout(600);
    }

    // Move to next question
    for (const dismissText of ['Continue', 'Keep Going', 'Next']) {
      const dismissBtn = page.locator('button').filter({ hasText: dismissText });
      if (await dismissBtn.count() > 0) {
        await dismissBtn.click();
        await page.waitForTimeout(400);
        break;
      }
    }

    if (i % 20 === 0) {
      console.log(`Searching... (${i} questions checked)`);
    }
  }

  if (!foundTrace) {
    console.log('\nNo trace question found. Checking if questions were loaded...');
  }

  console.log(`\nTest complete. Client errors: ${errors.length}`);
  errors.forEach(e => console.log(`  ERROR: ${e}`));

  await browser.close();
}

run().catch(console.error);
