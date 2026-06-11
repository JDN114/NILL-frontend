import { test, expect } from '@playwright/test';

// Visual regression tests — run with --update-snapshots to update baselines
// Only runs on chromium to keep snapshot files consistent across runs

const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);

async function login(page) {
  await page.goto('/');
  await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
}

test.describe('Visual Regression', () => {
  test('login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Hide any dynamic elements (dates, counters) to reduce snapshot noise
    await page.addStyleTag({
      content: '.dynamic-date, .counter, [data-testid="timestamp"] { visibility: hidden !important; }',
    });
    await expect(page).toHaveScreenshot('login.png', {
      maxDiffPixels: 100,
      animations: 'disabled',
    });
  });

  test('pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: '.dynamic-date, .counter { visibility: hidden !important; }',
    });
    await expect(page).toHaveScreenshot('pricing.png', {
      maxDiffPixels: 150,
      animations: 'disabled',
    });
  });

  test('dashboard', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');
    await login(page);
    await page.waitForLoadState('networkidle');
    // Mask live data fields
    await page.addStyleTag({
      content: `
        [class*="stat"], [class*="chart"], [data-testid="live"],
        .recharts-wrapper, canvas { visibility: hidden !important; }
      `,
    });
    await expect(page).toHaveScreenshot('dashboard.png', {
      maxDiffPixels: 200,
      animations: 'disabled',
    });
  });

  test('emails page — empty state or inbox list', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');
    await login(page);
    await page.goto('/emails');
    await page.waitForLoadState('networkidle');
    // Mask timestamps to avoid snapshot drift
    await page.addStyleTag({
      content: '.em-date, ._dateStr, [class*="date"], [class*="time"] { visibility: hidden !important; }',
    });
    await expect(page).toHaveScreenshot('emails-inbox.png', {
      maxDiffPixels: 300,
      animations: 'disabled',
    });
  });
});
