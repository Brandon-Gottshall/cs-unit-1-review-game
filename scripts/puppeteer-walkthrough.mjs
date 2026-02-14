#!/usr/bin/env node
/**
 * Playwright Walkthrough — LLM-driven visual testing
 *
 * Records a scripted walkthrough of the review game, capturing
 * debounced screenshots at each interaction point. Output is a
 * frame directory that can be fed to /review-video.
 *
 * Usage:
 *   node scripts/puppeteer-walkthrough.mjs [--url http://localhost:3099] [--out walkthrough.mp4]
 *
 * Requirements:
 *   npm install -D playwright
 *   ffmpeg (optional, for frame→video assembly)
 */

import { chromium } from 'playwright';
import { mkdir, rm } from 'fs/promises';
import { execSync } from 'child_process';
import path from 'path';

const BASE_URL = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:3099';

const OUTPUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'walkthrough.mp4';

const FRAME_DIR = '/tmp/walkthrough-frames';
const VIEWPORT = { width: 1280, height: 800 };
const DEBOUNCE_MS = 600;

let frameCount = 0;

async function capture(page, label) {
  await page.waitForTimeout(DEBOUNCE_MS);
  frameCount++;
  const filename = path.join(FRAME_DIR, `frame_${String(frameCount).padStart(4, '0')}.png`);
  await page.screenshot({ path: filename });
  console.log(`  Frame ${frameCount}: ${label}`);
}

/** Click the first visible, enabled button matching text pattern */
async function clickButton(page, textPattern) {
  const btn = page.locator(`button`).filter({ hasText: textPattern }).first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.click();
    return true;
  }
  return false;
}

/** Click the first visible, enabled MC answer option (button.rounded-lg) */
async function clickFirstAnswer(page) {
  const btns = await page.$$('button.rounded-lg');
  for (const btn of btns) {
    if (await btn.isVisible() && await btn.isEnabled()) {
      const text = await btn.textContent();
      if (text.trim().length > 1) {
        await btn.click();
        return text.trim();
      }
    }
  }
  return null;
}

async function run() {
  await rm(FRAME_DIR, { recursive: true, force: true });
  await mkdir(FRAME_DIR, { recursive: true });

  console.log(`Starting walkthrough of ${BASE_URL}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  try {
    // ─── Scene 1: Landing Page ──────────────────────
    console.log('\nScene 1: Landing Page');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await capture(page, 'landing-hero');

    await page.evaluate(() => window.scrollBy(0, 400));
    await capture(page, 'landing-question-pool');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await capture(page, 'landing-bottom');

    // ─── Scene 2: Start Quiz ────────────────────────
    console.log('\nScene 2: Start Quiz');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const started = await clickButton(page, 'Start Cram Session');
    if (started) {
      await page.waitForURL('**/quiz', { timeout: 5000 }).catch(() => {});
    } else {
      await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle', timeout: 15000 });
    }
    await page.waitForTimeout(1500);

    // Handle resume prompt if it appears
    const resumeVisible = await page.locator('button').filter({ hasText: 'Start Fresh' }).count();
    if (resumeVisible > 0) {
      await clickButton(page, 'Start Fresh');
      await page.waitForTimeout(1000);
    }

    await capture(page, 'quiz-first-question');

    // ─── Scene 3: Answer Cycle (3 questions) ────────
    console.log('\nScene 3: Answer Questions');
    for (let i = 0; i < 5; i++) {
      const badge = await page.$eval('[class*="gap-1.5"]', el => el.textContent?.trim()).catch(() => '');
      const question = await page.$eval('h2', el => el.textContent?.trim()).catch(() => '');
      console.log(`  Q${i+1}: [${badge}] ${question?.slice(0, 50)}`);

      // Select an answer
      const answer = await clickFirstAnswer(page);
      if (answer) {
        await page.waitForTimeout(300);
        await capture(page, `q${i+1}-selected`);

        // Submit
        const submitted = await clickButton(page, 'Submit Answer');
        if (submitted) {
          await page.waitForTimeout(1200);
          await capture(page, `q${i+1}-feedback`);
        }

        // Dismiss feedback overlay
        await page.waitForTimeout(400);
        const dismissed = await clickButton(page, 'Continue') || await clickButton(page, 'Keep Going') || await clickButton(page, 'Next');
        if (dismissed) {
          await page.waitForTimeout(600);
        }
      } else {
        // Try "I have no idea" flow
        const noIdea = await clickButton(page, 'I have no idea');
        if (noIdea) {
          await page.waitForTimeout(500);
          await clickButton(page, 'Yes, show me');
          await page.waitForTimeout(1000);
          await capture(page, `q${i+1}-revealed`);
          await clickButton(page, 'Continue');
          await page.waitForTimeout(600);
        } else {
          console.log('  Could not answer, breaking');
          await capture(page, 'stuck');
          break;
        }
      }
    }

    // ─── Scene 4: Concept Map ───────────────────────
    console.log('\nScene 4: Concept Map');
    const mapClicked = await clickButton(page, 'Map');
    if (mapClicked) {
      await page.waitForTimeout(1500);
      await capture(page, 'concept-map');

      // Close map — try multiple selectors for the × button
      const closeSel = [
        'button:has(svg.lucide-x)',          // lucide X icon button
        'button:has-text("×")',               // times char
        'button:has-text("✕")',               // multiplication sign
        '[aria-label="Close"]',
        '.fixed button:first-of-type',        // first button in overlay
      ];
      let closed = false;
      for (const sel of closeSel) {
        const btn = page.locator(sel).first();
        if (await btn.count() > 0 && await btn.isVisible()) {
          await btn.click({ force: true });
          closed = true;
          console.log(`  Closed map via: ${sel}`);
          break;
        }
      }
      if (!closed) {
        // Press Escape as last resort
        await page.keyboard.press('Escape');
        console.log('  Closed map via Escape');
      }
      await page.waitForTimeout(800);
    }

    // ─── Scene 5: History Panel ─────────────────────
    console.log('\nScene 5: History');
    // The history button shows count in parentheses — use force to bypass overlay remnants
    const historyBtn = page.locator('button').filter({ hasText: /History/i }).first();
    if (await historyBtn.count() > 0) {
      await historyBtn.click({ force: true, timeout: 5000 });
      await page.waitForTimeout(1000);
      await capture(page, 'history-panel');
    }

    // Final state
    await capture(page, 'final-state');

  } catch (err) {
    console.error('Walkthrough error:', err.message);
    await capture(page, 'error-state');
  }

  console.log(`\nClient-side errors: ${errors.length}`);
  if (errors.length > 0) errors.forEach(e => console.log(`  ${e}`));

  await browser.close();

  console.log(`\nCaptured ${frameCount} frames in ${FRAME_DIR}`);

  // Assemble into video if ffmpeg is available
  try {
    execSync('which ffmpeg', { stdio: 'ignore' });
    console.log(`Assembling ${OUTPUT}...`);
    execSync(
      `ffmpeg -y -framerate 1 -i "${FRAME_DIR}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" "${OUTPUT}"`,
      { stdio: 'inherit' }
    );
    console.log(`Video saved: ${OUTPUT}`);
  } catch {
    console.log('ffmpeg not found — skipping video assembly.');
    console.log(`Frames are in ${FRAME_DIR}/`);
  }
}

run().catch(console.error);
