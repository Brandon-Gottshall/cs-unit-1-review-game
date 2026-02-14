import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', err => errors.push(err.message));

// Fresh session
await page.goto('http://localhost:3099/quiz', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

console.log('=== E2E GAME FLOW WALKTHROUGH ===\n');

// Track question types seen
const typesSeen = new Set();
let questionsAnswered = 0;

for (let round = 1; round <= 25; round++) {
  // Get current state
  const badge = await page.$eval('[class*="gap-1.5"]', el => el.textContent?.trim()).catch(() => '');
  const question = await page.$eval('h2', el => el.textContent?.trim()).catch(() => '');

  if (!badge && !question) {
    // Check if we got a feedback overlay or "Session Complete"
    const bodyText = await page.textContent('body');
    if (bodyText.includes('Session Complete')) {
      console.log(`\nRound ${round}: SESSION COMPLETE`);
      break;
    }
    if (bodyText.includes('Application error')) {
      console.log(`\nRound ${round}: CLIENT ERROR`);
      console.log('Errors:', errors);
      await page.screenshot({ path: `/tmp/e2e-error-r${round}.png`, fullPage: true });
      break;
    }
    console.log(`Round ${round}: No question found, waiting...`);
    await page.waitForTimeout(1000);
    continue;
  }

  typesSeen.add(badge);
  console.log(`Round ${round}: [${badge}] "${question.slice(0, 70)}"`);

  // Screenshot special question types
  if (badge.includes('Bug') || badge.includes('Error') || badge.includes('Trace') || badge.includes('Output')) {
    await page.screenshot({ path: `/tmp/e2e-${badge.replace(/[^a-z]/gi, '')}-r${round}.png`, fullPage: true });
    console.log(`  >> Screenshot saved for ${badge}`);
  }

  // Try to answer the question
  let answered = false;

  // Strategy 1: Click an MC answer option (button.rounded-lg)
  const answerBtns = await page.$$('button.rounded-lg');
  for (const btn of answerBtns) {
    if (await btn.isVisible() && await btn.isEnabled()) {
      const text = await btn.textContent();
      if (text.trim().length > 1) {
        await btn.click();
        answered = true;
        break;
      }
    }
  }

  if (!answered) {
    // Strategy 2: Try distractor buttons in a grid (for VariableTraceViz)
    const gridBtns = await page.$$('button[class*="font-mono"]');
    for (const btn of gridBtns) {
      if (await btn.isVisible() && await btn.isEnabled()) {
        await btn.click();
        answered = true;
        break;
      }
    }
  }

  if (!answered) {
    // Strategy 3: Input field for typed answers
    const input = await page.$('input[placeholder*="answer"], input[placeholder*="output"]');
    if (input && await input.isVisible()) {
      await input.fill('test answer');
      answered = true;
    }
  }

  if (!answered) {
    // Strategy 4: Reveal Answer button (self-assessment)
    const revealBtn = page.locator('button:has-text("Reveal Answer")');
    if (await revealBtn.count() > 0 && await revealBtn.isVisible()) {
      await revealBtn.click();
      await page.waitForTimeout(500);
      const yesBtn = page.locator('button:has-text("Yes")');
      if (await yesBtn.count() > 0) {
        await yesBtn.first().click();
      }
      answered = true;
      console.log('  Used reveal flow');
    }
  }

  if (!answered) {
    console.log('  STUCK - no answer mechanism found');
    await page.screenshot({ path: `/tmp/e2e-stuck-r${round}.png`, fullPage: true });
    break;
  }

  await page.waitForTimeout(300);

  // Click Submit if present
  const submitBtn = page.locator('button:has-text("Submit Answer")');
  if (await submitBtn.count() > 0) {
    const isEnabled = await submitBtn.isEnabled().catch(() => false);
    if (isEnabled) {
      await submitBtn.click();
      console.log('  Submitted');
      await page.waitForTimeout(1000);
    }
  }

  questionsAnswered++;

  // Handle feedback overlay
  await page.waitForTimeout(500);

  // Look for feedback overlay buttons
  const feedbackSelectors = [
    'button:has-text("Continue")',
    'button:has-text("Next Question")',
    'button:has-text("Keep Going")',
    'button:has-text("Got it")',
  ];

  for (const sel of feedbackSelectors) {
    const btn = page.locator(sel);
    if (await btn.count() > 0 && await btn.first().isVisible()) {
      await btn.first().click();
      console.log('  Dismissed feedback');
      await page.waitForTimeout(800);
      break;
    }
  }
}

// Check bottom stats
const bodyText = await page.textContent('body');
const masteredMatch = bodyText.match(/(\d+)\s*\/\s*(\d+)\s*mastered/);
const remainingMatch = bodyText.match(/(\d+)\s*remaining/);

console.log('\n=== SUMMARY ===');
console.log(`Questions answered: ${questionsAnswered}`);
console.log(`Types seen: ${[...typesSeen].join(', ')}`);
console.log(`Mastered: ${masteredMatch ? masteredMatch[0] : 'unknown'}`);
console.log(`Remaining: ${remainingMatch ? remainingMatch[0] : 'unknown'}`);
console.log(`Client errors: ${errors.length}`);
if (errors.length > 0) console.log('Errors:', errors);

// Final screenshot
await page.screenshot({ path: '/tmp/e2e-final.png', fullPage: true });

// Now test the Map view
console.log('\n=== TESTING MAP VIEW ===');
const mapBtn = page.locator('button:has-text("Map")');
if (await mapBtn.count() > 0) {
  await mapBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/e2e-map.png', fullPage: true });
  const mapBody = await page.textContent('body');
  console.log('Map view loaded:', !mapBody.includes('Application error'));
} else {
  console.log('Map button not found');
}

await browser.close();
