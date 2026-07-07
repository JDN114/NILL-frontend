# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.js >> Visual Regression >> pricing page
- Location: tests/e2e/visual.spec.js:30:7

# Error details

```
Error: A snapshot doesn't exist at /root/nill/frontend/tests/e2e/visual.spec.js-snapshots/pricing-chromium-linux.png, writing actual.
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
  - generic [ref=e16]:
    - navigation [ref=e17]:
      - generic [ref=e18]:
        - link "NILL" [ref=e19] [cursor=pointer]:
          - /url: /
          - text: NILL
        - generic [ref=e22]:
          - link "Anmelden" [ref=e23] [cursor=pointer]:
            - /url: /login
          - link "Kostenlos starten" [ref=e24] [cursor=pointer]:
            - /url: /register
    - generic [ref=e26]:
      - generic [ref=e27]: Preise & Pläne
      - heading "Eine smarte Arbeitsstation" [level=1] [ref=e29]:
        - text: Eine smarte
        - emphasis [ref=e30]: Arbeitsstation
      - paragraph [ref=e31]: "Unser sofort verfügbares Produkt: Zeiterfassung, Taskmanagement und Lieferscheine — alles in einer Station. Ein Preis, beliebig viele Mitarbeiter. Ohne Wartezeit."
      - generic [ref=e32]: 14 Tage kostenlos testen · keine Kreditkarte
      - generic [ref=e35]:
        - button "Arbeitsstation" [ref=e36] [cursor=pointer]
        - button "NILL Komplett" [ref=e37] [cursor=pointer]
      - generic [ref=e39]:
        - button "Monatlich" [ref=e40] [cursor=pointer]
        - button "Jährlich −2 Mo." [ref=e41] [cursor=pointer]:
          - text: Jährlich
          - generic [ref=e42]: −2 Mo.
      - generic [ref=e45]:
        - generic [ref=e46]: Sofort verfügbar
        - generic [ref=e47]:
          - generic [ref=e49]: Unbegrenzte Stationen & Mitarbeiter
          - generic [ref=e50]: Arbeitsstation
          - generic [ref=e51]: Die smarte Arbeitsstation für Ihren Betrieb — Tablet & Kiosk
        - generic [ref=e52]:
          - generic [ref=e53]: 30€
          - generic [ref=e54]: / Monat
        - list [ref=e55]:
          - listitem [ref=e56]:
            - generic [ref=e58]: Smarte Arbeitsstation — Tablet- & Kiosk-Modus
          - listitem [ref=e59]:
            - generic [ref=e61]: Zeiterfassung mit QR-Mitarbeiterausweis
          - listitem [ref=e62]:
            - generic [ref=e64]: Aufgaben- & Taskmanagement fürs ganze Team
          - listitem [ref=e65]:
            - generic [ref=e67]: Lieferscheine, Inventur & Bestandsführung
          - listitem [ref=e68]:
            - generic [ref=e70]: "E-Mail-Integration: Gmail, Outlook & IMAP"
          - listitem [ref=e71]:
            - generic [ref=e73]: Teamverwaltung, Rollen & HR-Dokumente
        - button "Zahlungspflichtig abonnieren →" [ref=e74] [cursor=pointer]:
          - text: Zahlungspflichtig abonnieren
          - generic [ref=e75]: →
    - generic [ref=e77]:
      - generic [ref=e78]: FAQ
      - heading "Häufige Fragen" [level=2] [ref=e80]
      - generic [ref=e81]:
        - generic [ref=e83] [cursor=pointer]:
          - text: Was ist die Arbeitsstation — und warum wird sie zuerst angeboten?
          - generic [ref=e84]: +
        - generic [ref=e86] [cursor=pointer]:
          - text: Buchhaltung & NILL Sekretärin sind als „WIP" markiert — was heißt das?
          - generic [ref=e87]: +
        - generic [ref=e89] [cursor=pointer]:
          - text: Kann ich den Plan jederzeit wechseln?
          - generic [ref=e90]: +
        - generic [ref=e92] [cursor=pointer]:
          - text: Was passiert nach dem kostenlosen Test?
          - generic [ref=e93]: +
        - generic [ref=e95] [cursor=pointer]:
          - text: Sind die Preise inkl. Mehrwertsteuer?
          - generic [ref=e96]: +
        - generic [ref=e98] [cursor=pointer]:
          - text: Gibt es einen Enterprise-Plan für größere Teams?
          - generic [ref=e99]: +
    - paragraph [ref=e102]: Alle Preise zzgl. gesetzlicher MwSt. · Monatlich kündbar · SSL-verschlüsselt · DSGVO-konform
  - contentinfo [ref=e103]:
    - generic [ref=e104]:
      - generic [ref=e105]: © 2026 NILL
      - navigation [ref=e106]:
        - link "Impressum" [ref=e107] [cursor=pointer]:
          - /url: /Impressum
        - link "Datenschutz" [ref=e108] [cursor=pointer]:
          - /url: /Datenschutz
        - link "AGB" [ref=e109] [cursor=pointer]:
          - /url: /agb
        - link "Widerruf" [ref=e110] [cursor=pointer]:
          - /url: /Widerruf
        - link "GoBD" [ref=e111] [cursor=pointer]:
          - /url: /gobd
        - link "Barrierefreiheit" [ref=e112] [cursor=pointer]:
          - /url: /barrierefreiheit
        - button "Cookie-Einstellungen" [ref=e113] [cursor=pointer]
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
  24 |     await expect(page).toHaveScreenshot('login.png', {
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
> 36 |     await expect(page).toHaveScreenshot('pricing.png', {
     |     ^ Error: A snapshot doesn't exist at /root/nill/frontend/tests/e2e/visual.spec.js-snapshots/pricing-chromium-linux.png, writing actual.
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