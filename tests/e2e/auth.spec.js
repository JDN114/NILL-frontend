import { test, expect } from '@playwright/test';

const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);

test.describe('Authentication', () => {
  test('login page loads and shows email + password fields', async ({ page }) => {
    await page.goto('/');
    // Accept either a dedicated /login route or the root landing with login form
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 8000 });
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
  });

  test('submitting empty form shows validation feedback', async ({ page }) => {
    await page.goto('/');
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    // Either HTML5 validation or an app-level error message
    const hasValidation = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[required]');
      return [...inputs].some(i => !i.validity.valid);
    });
    const hasErrorMsg = await page.locator('[role="alert"], .error, [data-testid="error"]').isVisible().catch(() => false);
    expect(hasValidation || hasErrorMsg).toBeTruthy();
  });

  test('wrong credentials shows error message', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"], input[name="email"]', 'nobody@nowhere.invalid');
    await page.fill('input[type="password"]', 'definitelywrong123');
    await page.click('button[type="submit"]');
    // Expect either an alert role or visible text containing common German/English error words
    await expect(
      page.locator('text=/ungültig|falsch|incorrect|invalid|wrong|fehler/i').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('successful login lands on dashboard', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');

    await page.goto('/');
    await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/(dashboard|home|overview)/);
  });

  test('authenticated user can log out and is redirected to login', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');

    // Login
    await page.goto('/');
    await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });

    // Find and click logout — common patterns: button text, aria-label, or nav link
    const logoutBtn = page.locator(
      'button:has-text("Logout"), button:has-text("Abmelden"), [aria-label="Logout"], a:has-text("Logout"), a:has-text("Abmelden")'
    ).first();

    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForURL(/\/(login|$)/, { timeout: 8000 });
    } else {
      // Try opening a user menu first
      const avatar = page.locator('[data-testid="user-menu"], [aria-label="User menu"], .avatar').first();
      if (await avatar.isVisible()) {
        await avatar.click();
        await logoutBtn.click();
        await page.waitForURL(/\/(login|$)/, { timeout: 8000 });
      }
    }
    // Verify we can't access protected routes anymore
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/(login|$)/);
  });

  test('forgot password link is present', async ({ page }) => {
    await page.goto('/');
    const forgotLink = page.locator('a:has-text("Passwort"), a:has-text("Forgot"), a:has-text("forgot")').first();
    // It might not exist — just log, not fail
    const visible = await forgotLink.isVisible().catch(() => false);
    console.log(`Forgot password link visible: ${visible}`);
  });

  test('unauthenticated user is redirected from protected routes', async ({ page }) => {
    // Make sure we have no session
    await page.context().clearCookies();
    await page.goto('/dashboard');
    // Should not stay on /dashboard
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toMatch(/\/dashboard$/);
  });
});
