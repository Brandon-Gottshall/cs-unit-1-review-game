import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Clear localStorage first to reset SR state, then force the identify_error question to be first
await page.goto('http://localhost:3099/quiz', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

// Take screenshots as we click through. The pool is only 9 questions so we should hit identify_error.
// Strategy: click first non-disabled answer option, then Submit, then handle feedback.
for (let i = 0; i < 15; i++) {
  await page.waitForTimeout(500);

  // Get current question badge and text
  const badge = await page.$eval('[class*="gap-1.5"]', el => el.textContent).catch(() => '');
  const question = await page.$eval('h2', el => el.textContent).catch(() => '');
  console.log(`\nQ${i+1}: [${badge.trim()}] ${question.slice(0,80)}`);

  // Check if this is a code-based question (has a textarea or code block with monospace styling)
  const codeBlock = await page.$('textarea[class*="mono"], div[class*="font-mono"] textarea');
  if (codeBlock || badge.includes('Bug') || question.includes('wrong with')) {
    console.log('>>> FOUND CODE QUESTION - screenshotting');
    await page.screenshot({ path: '/tmp/quiz-code-question.png', fullPage: true });
  }

  // Find clickable answer options - they're buttons inside the card
  // Answer buttons have class containing "rounded-lg border" and substantial text
  const answerButtons = await page.$$('button.rounded-lg');
  let clicked = false;
  for (const btn of answerButtons) {
    const isVisible = await btn.isVisible();
    const isEnabled = await btn.isEnabled();
    const text = await btn.textContent();
    if (isVisible && isEnabled && text.trim().length > 2) {
      await btn.click();
      clicked = true;
      console.log(`  Clicked: "${text.trim().slice(0,40)}"`);
      break;
    }
  }

  if (!clicked) {
    // Maybe it's a reveal-style question - look for "Reveal Answer" button
    const revealBtn = page.locator('button:has-text("Reveal Answer")');
    if (await revealBtn.count() > 0) {
      await revealBtn.click();
      await page.waitForTimeout(500);
      // Click "Got it" or self-assess
      const gotItBtn = page.locator('button:has-text("Got it"), button:has-text("Yes")');
      if (await gotItBtn.count() > 0) {
        await gotItBtn.first().click();
      }
      clicked = true;
      console.log('  Used reveal flow');
    }
  }

  if (!clicked) {
    console.log('  No clickable answer found, breaking');
    await page.screenshot({ path: '/tmp/quiz-stuck.png', fullPage: true });
    break;
  }

  await page.waitForTimeout(300);

  // Click Submit if present
  const submitBtn = page.locator('button:has-text("Submit Answer")');
  if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
    await submitBtn.click();
    console.log('  Submitted');
    await page.waitForTimeout(1500);
  }

  // Handle feedback overlay - look for Continue/Next/Got it buttons
  await page.waitForTimeout(500);
  const feedbackBtns = page.locator('button:has-text("Continue"), button:has-text("Next Question"), button:has-text("Keep Going")');
  if (await feedbackBtns.count() > 0) {
    await feedbackBtns.first().click();
    console.log('  Dismissed feedback');
    await page.waitForTimeout(800);
  }
}

await page.screenshot({ path: '/tmp/quiz-final.png', fullPage: true });
console.log('\nDone');
await browser.close();
