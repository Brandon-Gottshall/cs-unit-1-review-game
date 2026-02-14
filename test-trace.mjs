import { chromium } from 'playwright';
const BASE_URL = 'http://localhost:3099';
async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);
  // Handle resume prompt
  const sf = page.locator('button').filter({ hasText: 'Start Fresh' });
  if (await sf.count() > 0) { await sf.click(); await page.waitForTimeout(1000); }
  
  for (let i = 0; i < 50; i++) {
    const badge = await page.$eval('[class*="gap-1.5"]', el => el.textContent?.trim()).catch(() => '');
    const q = await page.$eval('h2', el => el.textContent?.trim()).catch(() => '');
    console.log(`Q${i+1}: [${badge}] ${q?.slice(0, 60)}`);
    if (badge.includes('Trace')) {
      console.log('FOUND TRACE!');
      await page.screenshot({ path: '/tmp/trace-before.png' });
      // Check code block visibility
      const codeBlock = await page.$('pre.font-mono');
      console.log(`Code block visible: ${!!codeBlock}`);
      // Count MC buttons
      const opts = await page.$$eval('button.rounded-lg:not(:disabled)', btns => btns.map(b => b.textContent?.trim()).filter(t => t && t.length > 1 && !t.includes('Submit')));
      console.log(`MC options: ${opts.length}: ${opts.join(' | ')}`);
      // Click first option, submit
      if (opts.length > 0) {
        await page.locator('button.rounded-lg').filter({ hasText: opts[0] }).click();
        await page.waitForTimeout(300);
        await page.locator('button').filter({ hasText: 'Submit Answer' }).click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: '/tmp/trace-after.png' });
      }
      break;
    }
    // Quick answer to skip
    const opt = await page.$$eval('button.rounded-lg:not(:disabled)', btns => { for (const b of btns) { const t = b.textContent?.trim(); if (t && t.length > 1 && !t.includes('Submit') && !t.includes('Continue') && !t.includes('Keep') && !t.includes('no idea')) return t; } return null; });
    if (opt) {
      await page.locator('button.rounded-lg').filter({ hasText: opt }).first().click();
      await page.waitForTimeout(200);
    } else {
      const noIdea = page.locator('button').filter({ hasText: 'I have no idea' });
      if (await noIdea.count() > 0) { await noIdea.click(); await page.waitForTimeout(300); const ys = page.locator('button').filter({ hasText: 'Yes, show me' }); if (await ys.count() > 0) await ys.click(); await page.waitForTimeout(300); }
    }
    const sub = page.locator('button').filter({ hasText: 'Submit Answer' });
    if (await sub.count() > 0 && await sub.isEnabled()) { await sub.click(); await page.waitForTimeout(600); }
    for (const d of ['Continue', 'Keep Going', 'Next']) {
      const db = page.locator('button').filter({ hasText: d });
      if (await db.count() > 0 && await db.isVisible()) { await db.click(); await page.waitForTimeout(400); break; }
    }
  }
  console.log(`Errors: ${errors.length}`);
  errors.forEach(e => console.log(`  ERR: ${e}`));
  await browser.close();
}
run().catch(console.error);
