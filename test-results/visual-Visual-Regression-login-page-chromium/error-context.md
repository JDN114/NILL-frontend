# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.js >> Visual Regression >> login page
- Location: tests/e2e/visual.spec.js:17:7

# Error details

```
Error: A snapshot doesn't exist at /root/nill/frontend/tests/e2e/visual.spec.js-snapshots/login-chromium-linux.png, writing actual.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - img
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e10]: Cookies & Datenschutz
        - paragraph [ref=e11]:
          - text: Wir verwenden Cookies für anonyme Nutzungsanalysen — Seitenaufrufe, Verweildauer, Länder und Interaktionen. Du entscheidest, was du erlaubst.
          - button "Details ▼" [ref=e12] [cursor=pointer]
      - generic [ref=e13]:
        - button "Nur notwendige" [ref=e14] [cursor=pointer]
        - button "Alle akzeptieren ✓" [ref=e15] [cursor=pointer]
  - generic [ref=e17]:
    - generic [ref=e20] [cursor=pointer]: NILL
    - heading "Willkommen zurück." [level=1] [ref=e21]:
      - text: Willkommen
      - emphasis [ref=e22]: zurück.
    - paragraph [ref=e23]: Meld dich an und lass die KI weiterarbeiten.
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]: E-Mail
        - textbox "E-Mail" [ref=e27]:
          - /placeholder: du@firma.de
      - generic [ref=e28]:
        - generic [ref=e29]: Passwort
        - textbox "Passwort" [ref=e30]:
          - /placeholder: ••••••••
      - button "Anmelden →" [ref=e31] [cursor=pointer]
    - paragraph [ref=e33]: Passwort vergessen?
    - paragraph [ref=e34]: Noch kein Konto? Registrieren
  - contentinfo [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]: © 2026 NILL
      - navigation [ref=e38]:
        - link "Impressum" [ref=e39] [cursor=pointer]:
          - /url: /Impressum
        - link "Datenschutz" [ref=e40] [cursor=pointer]:
          - /url: /Datenschutz
        - link "AGB" [ref=e41] [cursor=pointer]:
          - /url: /agb
        - link "Widerruf" [ref=e42] [cursor=pointer]:
          - /url: /Widerruf
        - link "GoBD" [ref=e43] [cursor=pointer]:
          - /url: /gobd
        - link "Barrierefreiheit" [ref=e44] [cursor=pointer]:
          - /url: /barrierefreiheit
        - button "Cookie-Einstellungen" [ref=e45] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Visual regression tests — run with --update-snapshots to update baselines
  4  | // Only runs on chromium to keep snapshot files consistent across runs
  5  | 
  6  | const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);
  7  | 
  8  | async function login(page) {
  9  |   await page.goto('/login');
  10 |   await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  11 |   await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  12 |   await page.click('button[type="submit"]');
  13 |   await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
  14 | }
  15 | 
  16 | test.describe('Visual Regression', () => {
  17 |   test('login page', async ({ page }) => {
  18 |     await page.goto('/login');
  19 |     await page.waitForLoadState('networkidle');
  20 |     // Hide any dynamic elements (dates, counters) to reduce snapshot noise
  21 |     await page.addStyleTag({
  22 |       content: '.dynamic-date, .counter, [data-testid="timestamp"] { visibility: hidden !important; }',
  23 |     });
> 24 |     await expect(page).toHaveScreenshot('login.png', {
     |     ^ Error: A snapshot doesn't exist at /root/nill/frontend/tests/e2e/visual.spec.js-snapshots/login-chromium-linux.png, writing actual.
  25 |       maxDiffPixels: 100,
  26 |       animations: 'disabled',
  27 |     });
  28 |   });
  29 | 
  30 |   test('pricing page', async ({ page }) => {
  31 |     await page.goto('/pricing');
  32 |     await page.waitForLoadState('networkidle');
  33 |     await page.addStyleTag({
  34 |       content: '.dynamic-date, .counter { visibility: hidden !important; }',
  35 |     });
  36 |     await expect(page).toHaveScreenshot('pricing.png', {
  37 |       maxDiffPixels: 150,
  38 |       animations: 'disabled',
  39 |     });
  40 |   });
  41 | 
  42 |   test('dashboard', async ({ page }) => {
  43 |     test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');
  44 |     await login(page);
  45 |     await page.waitForLoadState('networkidle');
  46 |     // Mask live data fields
  47 |     await page.addStyleTag({
  48 |       content: `
  49 |         [class*="stat"], [class*="chart"], [data-testid="live"],
  50 |         .recharts-wrapper, canvas { visibility: hidden !important; }
  51 |       `,
  52 |     });
  53 |     await expect(page).toHaveScreenshot('dashboard.png', {
  54 |       maxDiffPixels: 200,
  55 |       animations: 'disabled',
  56 |     });
  57 |   });
  58 | 
  59 |   test('emails page — empty state or inbox list', async ({ page }) => {
  60 |     test.skip(!HAS_CREDS, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');
  61 |     await login(page);
  62 |     await page.goto('/emails');
  63 |     await page.waitForLoadState('networkidle');
  64 |     // Mask timestamps to avoid snapshot drift
  65 |     await page.addStyleTag({
  66 |       content: '.em-date, ._dateStr, [class*="date"], [class*="time"] { visibility: hidden !important; }',
  67 |     });
  68 |     await expect(page).toHaveScreenshot('emails-inbox.png', {
  69 |       maxDiffPixels: 300,
  70 |       animations: 'disabled',
  71 |     });
  72 |   });
  73 | });
  74 | 
```