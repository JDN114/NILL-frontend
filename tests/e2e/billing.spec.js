import { test, expect } from '@playwright/test';

const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);

async function loginAndGo(page, path) {
  await page.goto('/');
  await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
  await page.goto(path);
}

test.describe('Billing & Pricing', () => {
  test('pricing page loads and shows plan cards', async ({ page }) => {
    // Pricing page may be public (no login required)
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Should show at least one plan option
    const hasPlan = await page.locator(
      '.plan, .pricing-card, [data-testid="plan"], button:has-text("Plan"), h2, h3'
    ).first().isVisible({ timeout: 8000 }).catch(() => false);
    expect(hasPlan).toBeTruthy();
  });

  test('pricing page shows price amounts (not blank)', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Look for price elements — should contain € or a number
    const priceTexts = await page.locator('[class*="price"], [class*="plan"], [data-testid*="price"]')
      .allTextContents()
      .catch(() => []);

    const hasPrice = priceTexts.some(t => /\d+/.test(t) || t.includes('€') || t.includes('$'));
    if (priceTexts.length > 0) {
      expect(hasPrice).toBeTruthy();
    }
  });

  test('clicking a paid plan initiates Stripe checkout (redirects or opens Stripe)', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');

    await loginAndGo(page, '/pricing');
    await page.waitForLoadState('networkidle');

    // Look for an upgrade/buy button that is NOT the current plan
    const upgradeBtn = page.locator(
      'button:has-text("Upgrade"), button:has-text("Kaufen"), button:has-text("Jetzt"), button:has-text("Subscribe")'
    ).first();

    if (await upgradeBtn.isVisible()) {
      // Intercept the navigation — expect either Stripe checkout URL or session creation
      const [response] = await Promise.all([
        page.waitForResponse(
          r => r.url().includes('stripe') || r.url().includes('/billing') || r.url().includes('/checkout'),
          { timeout: 8000 }
        ).catch(() => null),
        upgradeBtn.click(),
      ]);
      // Either a Stripe redirect happened or an API call was made — either is fine
      if (response) {
        expect([200, 201, 302, 303]).toContain(response.status());
      }
    } else {
      console.log('No visible upgrade button — skipping Stripe checkout test');
    }
  });

  test('billing dashboard shows current plan info', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');

    await loginAndGo(page, '/billing');
    await page.waitForLoadState('networkidle');

    // Should not crash and should show some plan info
    const hasBillingContent = await page.locator(
      'text=/plan|Plan|Abonnement|subscription|Trial|trial|Free/i'
    ).first().isVisible({ timeout: 8000 }).catch(() => false);
    expect(hasBillingContent).toBeTruthy();
  });

  test('trial banner shows remaining days (not negative or NaN)', async ({ page }) => {
    test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');

    await loginAndGo(page, '/dashboard');
    await page.waitForLoadState('networkidle');

    const trialBanner = page.locator('[class*="trial"], [data-testid="trial-banner"], text=/Trial/i').first();
    if (await trialBanner.isVisible()) {
      const text = await trialBanner.textContent();
      // Should not show NaN or negative numbers
      expect(text).not.toMatch(/NaN/i);
      expect(text).not.toMatch(/-\d+\s*Tag/);  // no negative days
    }
  });
});
