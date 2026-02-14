import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3099/quiz', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

// Answer a question correctly and screenshot the feedback
console.log('=== TESTING CORRECT ANSWER FEEDBACK ===');

// Get the correct answer from the question card
const correctAnswer = await page.evaluate(() => {
  // Access the React fiber to find the correct answer
  // Fallback: just click each option and check
  return null;
});

// Strategy: try each answer option, looking at results
const answerBtns = await page.$$('button.rounded-lg');
if (answerBtns.length > 0) {
  // Click first option
  await answerBtns[0].click();
  await page.waitForTimeout(200);

  // Click submit
  const submitBtn = page.locator('button:has-text("Submit Answer")');
  await submitBtn.click();
  await page.waitForTimeout(1500);

  // Screenshot the result state (before dismissing feedback)
  await page.screenshot({ path: '/tmp/feedback-after-answer.png', fullPage: true });
  console.log('Captured post-answer state');

  // Check if feedback overlay appeared
  const feedbackVisible = await page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Keep Going")').count();
  console.log(`Feedback overlay visible: ${feedbackVisible > 0}`);

  if (feedbackVisible > 0) {
    await page.screenshot({ path: '/tmp/feedback-overlay.png', fullPage: true });
    console.log('Captured feedback overlay');

    // Dismiss
    await page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Keep Going")').first().click();
    await page.waitForTimeout(800);
  }
}

// Continue for a few more rounds to find special question types
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(400);

  const badge = await page.$eval('[class*="gap-1.5"]', el => el.textContent?.trim()).catch(() => '');
  const question = await page.$eval('h2', el => el.textContent?.trim()).catch(() => '');

  if (badge.includes('Bug') || badge.includes('Error') || badge.includes('Trace') || badge.includes('Output') || badge.includes('Valid') || badge.includes('Analyze')) {
    console.log(`\nFOUND SPECIAL TYPE: [${badge}] "${question.slice(0, 60)}"`);
    await page.screenshot({ path: `/tmp/special-${badge.replace(/[^a-zA-Z]/g, '')}.png`, fullPage: true });
  }

  // Quick answer flow
  const btns = await page.$$('button.rounded-lg');
  if (btns.length > 0 && await btns[0].isVisible() && await btns[0].isEnabled()) {
    await btns[0].click();
    await page.waitForTimeout(200);

    const submit = page.locator('button:has-text("Submit Answer")');
    if (await submit.count() > 0 && await submit.isEnabled()) {
      await submit.click();
      await page.waitForTimeout(1000);
    }

    // Dismiss feedback
    const fb = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Keep Going")');
    if (await fb.count() > 0) {
      await fb.first().click();
      await page.waitForTimeout(500);
    }
  } else {
    // Try reveal flow
    const reveal = page.locator('button:has-text("Reveal Answer")');
    if (await reveal.count() > 0) {
      await reveal.click();
      await page.waitForTimeout(500);
      const yes = page.locator('button:has-text("Yes"), button:has-text("Got it")');
      if (await yes.count() > 0) await yes.first().click();
      await page.waitForTimeout(500);
    } else {
      // Try "I have no idea"
      const noIdea = page.locator('button:has-text("I have no idea")');
      if (await noIdea.count() > 0) {
        await noIdea.click();
        await page.waitForTimeout(500);
        const confirm = page.locator('button:has-text("Yes, show me")');
        if (await confirm.count() > 0) await confirm.click();
        await page.waitForTimeout(800);
      }
    }

    // Dismiss any remaining feedback
    const fb2 = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Keep Going")');
    if (await fb2.count() > 0) {
      await fb2.first().click();
      await page.waitForTimeout(500);
    }
  }
}

console.log(`\nErrors: ${errors.length}`);
if (errors.length > 0) console.log(errors);

await browser.close();
