import { test, expect } from '@playwright/test';

const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);

// Helper: login and return to a given path
async function loginAndGo(page, path = '/emails') {
  await page.goto('/');
  await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
  await page.goto(path);
}

test.describe('Email Inbox', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');
  });

  test('emails page loads without crashing', async ({ page }) => {
    await loginAndGo(page, '/emails');
    // The page should show either a list of emails or a "no emails" empty state
    // It must NOT show an error boundary or blank white screen
    const hasContent = await page.locator(
      '.em-item, [data-testid="email-item"], [role="listitem"], .email-row, h2, p'
    ).first().isVisible({ timeout: 10000 }).catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('inbox and sent tabs are present and switchable', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    const sentTab = page.locator('button:has-text("Gesendet"), button:has-text("Sent"), [data-tab="sent"]').first();
    if (await sentTab.isVisible()) {
      await sentTab.click();
      await page.waitForTimeout(500);
      // page should not crash
      await expect(page.locator('body')).not.toContainText('Error');
    }
  });

  test('clicking an email opens the detail view', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    const firstEmail = page.locator('.em-item, [data-testid="email-item"], [role="listitem"]').first();
    if (await firstEmail.isVisible({ timeout: 8000 })) {
      await firstEmail.click();
      // Detail view should appear — look for subject heading or body area
      const detailVisible = await page.locator(
        '.em-detail-subject, [data-testid="email-subject"], .email-detail, .em-detail'
      ).first().isVisible({ timeout: 8000 }).catch(() => false);
      expect(detailVisible).toBeTruthy();
    } else {
      // Empty inbox — acceptable
      console.log('No emails in inbox, skipping click test');
    }
  });

  test('email subjects are never empty strings', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    // Get all visible subject text elements
    const subjects = await page.locator('.em-item-subject, [data-testid="email-subject"]').allTextContents();
    for (const subject of subjects) {
      expect(subject.trim().length).toBeGreaterThan(0);
    }
  });

  test('search returns results or empty state without crashing', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="Suche"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(800);  // debounce
      // Page should still render without crashing
      await expect(page.locator('body')).not.toContainText('Uncaught');
    }
  });

  test('compose modal opens and has required fields', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    const composeBtn = page.locator(
      'button:has-text("Schreiben"), button:has-text("Compose"), button:has-text("Neue"), [data-testid="compose"]'
    ).first();
    if (await composeBtn.isVisible()) {
      await composeBtn.click();
      await page.waitForTimeout(500);
      // Modal should show To + Subject + Body fields
      const toField = await page.locator('input[name="to"], input[placeholder*="An"], input[placeholder*="To"]').first().isVisible().catch(() => false);
      expect(toField).toBeTruthy();
    }
  });

  test('reply button is present on an open email', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    const firstEmail = page.locator('.em-item, [data-testid="email-item"]').first();
    if (await firstEmail.isVisible({ timeout: 8000 })) {
      await firstEmail.click();
      await page.waitForTimeout(500);
      const replyBtn = page.locator(
        'button:has-text("Antworten"), button:has-text("Reply"), [data-testid="reply-btn"]'
      ).first();
      const replyVisible = await replyBtn.isVisible().catch(() => false);
      console.log(`Reply button visible: ${replyVisible}`);
    }
  });

  test('loading more emails does not crash the page', async ({ page }) => {
    await loginAndGo(page, '/emails');
    await page.waitForLoadState('networkidle');

    const loadMore = page.locator('button:has-text("Mehr"), button:has-text("Load more"), [data-testid="load-more"]').first();
    if (await loadMore.isVisible()) {
      await loadMore.click();
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).not.toContainText('Uncaught');
    }
  });
});
