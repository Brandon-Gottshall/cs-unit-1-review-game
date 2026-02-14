import { chromium } from 'playwright';

const BASE = 'http://localhost:3870';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// Collect console errors
const errors = [];
page.on('pageerror', err => errors.push(err.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

// Landing page
console.log('📸 Landing page...');
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-landing.png', fullPage: true });
console.log('  ✅ Saved ss-landing.png');

// Quiz page - wait for hydration
console.log('📸 Quiz page...');
await page.goto(BASE + '/quiz', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000); // Give client components time to hydrate
await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-quiz-initial.png', fullPage: true });
console.log('  ✅ Saved ss-quiz-initial.png');

// Check if "Loading..." is still showing (hydration failed)
const loadingText = await page.locator('text=Loading...').count();
if (loadingText > 0) {
  console.log('  ⚠️  Still showing "Loading..." after 3s — hydration may have failed');
  // Wait longer
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-quiz-after-wait.png', fullPage: true });
  const stillLoading = await page.locator('text=Loading...').count();
  if (stillLoading > 0) {
    console.log('  ❌ Still "Loading..." after 8s total — client hydration broken');
  } else {
    console.log('  ✅ Hydrated after extended wait');
  }
} else {
  console.log('  ✅ Hydrated successfully');
}

// Try to interact — click an answer if one exists
const answerButtons = await page.locator('button').filter({ hasText: /^(?!.*Exit|.*Home|.*Back)/ }).all();
console.log(`  Found ${answerButtons.length} buttons on quiz page`);

// Take final quiz state
await page.screenshot({ path: '/sessions/blissful-wonderful-goldberg/ss-quiz-final.png', fullPage: true });

if (errors.length > 0) {
  console.log('\n❌ Console errors detected:');
  errors.forEach(e => console.log('  ', e));
} else {
  console.log('\n✅ No console errors');
}

await browser.close();
