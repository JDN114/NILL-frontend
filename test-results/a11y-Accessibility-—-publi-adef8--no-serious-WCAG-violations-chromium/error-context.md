# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.js >> Accessibility — public pages >> barrierefreiheit (/barrierefreiheit) has no serious WCAG violations
- Location: tests/e2e/a11y.spec.js:109:9

# Error details

```
Error: 1 WCAG violation(s) at impact "serious"+ on "barrierefreiheit":
  [serious] color-contrast: Elements must meet minimum color contrast ratio thresholds

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 268

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"nf-copy\">© 2026 NILL</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".nf-copy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/Impressum\">Impressum</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"Impressum\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/Datenschutz\">Datenschutz</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"Datenschutz\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/agb\">AGB</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"agb\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/Widerruf\">Widerruf</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"Widerruf\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/gobd\">GoBD</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"gobd\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/barrierefreiheit\">Barrierefreiheit</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"barrierefreiheit\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
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
    - button "NILL" [ref=e18] [cursor=pointer]:
      - generic [ref=e21]: NILL
    - generic [ref=e22]: Rechtliche Informationen
    - heading "Barrierefreiheitserklärung" [level=1] [ref=e24]
    - generic [ref=e26]:
      - paragraph [ref=e27]: "Stand: Mai 2026"
      - generic [ref=e28]:
        - heading "Geltungsbereich" [level=2] [ref=e29]
        - paragraph [ref=e30]:
          - text: Diese Barrierefreiheitserklärung gilt für die Webanwendung NILL unter
          - strong [ref=e31]: nillai.de
          - text: und alle zugehörigen Subdomains (dashboard.nillai.de). NILL ist ein kommerzielles SaaS-Produkt und unterliegt als solches den Anforderungen des Barrierefreiheitsstärkungsgesetzes (BFSG).
      - generic [ref=e32]:
        - heading "Stand der Barrierefreiheit" [level=2] [ref=e33]
        - paragraph [ref=e34]:
          - text: NILL ist
          - strong [ref=e35]: teilweise konform
          - text: mit den Anforderungen der Web Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA.
        - paragraph [ref=e36]: "Bekannte Einschränkungen:"
        - list [ref=e37]:
          - listitem [ref=e38]: Einige komplexe Datentabellen (Buchhaltung, Rechnungen) verfügen noch nicht über vollständige ARIA-Tabellenrollen.
          - listitem [ref=e39]: Einige Statusmeldungen werden noch nicht über Live-Regionen (aria-live) angekündigt.
          - listitem [ref=e40]: Ein formeller WCAG-Audit durch eine externe Prüfstelle steht aus.
      - generic [ref=e41]:
        - heading "Feedback und Kontakt" [level=2] [ref=e42]
        - paragraph [ref=e43]: "Wenn Sie Barrieren auf unserer Plattform feststellen oder Unterstützung benötigen, wenden Sie sich bitte an:"
        - generic [ref=e44]:
          - strong [ref=e45]: NILL
          - text: "E-Mail:"
          - link "support@nillai.de" [ref=e46] [cursor=pointer]:
            - /url: mailto:support@nillai.de
        - paragraph [ref=e47]: Wir bemühen uns, Anfragen innerhalb von 5 Werktagen zu beantworten.
      - generic [ref=e48]:
        - heading "Durchsetzungsverfahren" [level=2] [ref=e49]
        - paragraph [ref=e50]:
          - text: Wenn Sie auf eine Beschwerde keine zufriedenstellende Antwort erhalten, können Sie sich an die zuständige Durchsetzungsstelle wenden. Für privatwirtschaftliche Anbieter ist dies die
          - strong [ref=e51]: Marktüberwachungsbehörde Ihres Bundeslandes
          - text: .
  - contentinfo [ref=e52]:
    - generic [ref=e53]:
      - generic [ref=e54]: © 2026 NILL
      - navigation [ref=e55]:
        - link "Impressum" [ref=e56] [cursor=pointer]:
          - /url: /Impressum
        - link "Datenschutz" [ref=e57] [cursor=pointer]:
          - /url: /Datenschutz
        - link "AGB" [ref=e58] [cursor=pointer]:
          - /url: /agb
        - link "Widerruf" [ref=e59] [cursor=pointer]:
          - /url: /Widerruf
        - link "GoBD" [ref=e60] [cursor=pointer]:
          - /url: /gobd
        - link "Barrierefreiheit" [ref=e61] [cursor=pointer]:
          - /url: /barrierefreiheit
        - button "Cookie-Einstellungen" [ref=e62] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | 
  4   | /*
  5   |  * Accessibility (BFSG / WCAG 2.1 AA) automated checks.
  6   |  *
  7   |  * Why this exists: the Lighthouse CI job scans `./dist` (the static SPA shell),
  8   |  * so it only ever audits the public landing page — never the authenticated
  9   |  * accounting / invoice tables that Barrierefreiheit.jsx flags as not yet
  10  |  * conformant. These Playwright specs log in and run axe-core against the real
  11  |  * pages, including the ones behind auth.
  12  |  *
  13  |  * axe-core only covers the automatable subset of WCAG (~30-40%); a passing run
  14  |  * is NOT a full WCAG audit, but it catches the regressions that machines can.
  15  |  */
  16  | 
  17  | const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);
  18  | 
  19  | // WCAG 2.0 + 2.1, levels A and AA — the BFSG-relevant scope.
  20  | const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
  21  | 
  22  | // Which impact levels fail the build. axe levels: minor < moderate < serious < critical.
  23  | // Default fails on serious+critical (the ones that actually block users such as
  24  | // screen-reader-broken tables and missing names); moderate/minor are reported only.
  25  | const FAIL_LEVEL = process.env.A11Y_FAIL_LEVEL || 'serious';
  26  | const RANK = { minor: 1, moderate: 2, serious: 3, critical: 4 };
  27  | const FAIL_RANK = RANK[FAIL_LEVEL] || RANK.serious;
  28  | 
  29  | /**
  30  |  * Run axe on the current page, attach a full report, log a summary, and assert
  31  |  * there are no violations at or above FAIL_LEVEL.
  32  |  */
  33  | async function checkA11y(page, testInfo, label) {
  34  |   // Cross-origin iframes (e.g. itrk.legal legal docs) can't be analysed by axe
  35  |   // and aren't ours to fix — exclude them so they don't add noise.
  36  |   //
  37  |   // SPAs perform client-side redirects/route normalisation after mount, which
  38  |   // can destroy the execution context mid-scan. Let the page settle, then retry
  39  |   // the analysis a couple of times if a navigation races the injected axe run.
  40  |   let results;
  41  |   for (let attempt = 1; attempt <= 3; attempt++) {
  42  |     try {
  43  |       await page.waitForLoadState('domcontentloaded');
  44  |       await page.waitForTimeout(1200); // let post-mount redirects settle
  45  |       results = await new AxeBuilder({ page })
  46  |         .withTags(WCAG_TAGS)
  47  |         .exclude('iframe')
  48  |         .analyze();
  49  |       break;
  50  |     } catch (err) {
  51  |       const racing = /execution context was destroyed|navigation|frame was detached/i.test(err.message);
  52  |       if (racing && attempt < 3) {
  53  |         await page.waitForTimeout(1500);
  54  |         continue;
  55  |       }
  56  |       throw err;
  57  |     }
  58  |   }
  59  | 
  60  |   const violations = results.violations;
  61  | 
  62  |   // Attach the raw report to the Playwright HTML report for triage.
  63  |   await testInfo.attach(`axe-${label}.json`, {
  64  |     body: JSON.stringify(violations, null, 2),
  65  |     contentType: 'application/json',
  66  |   });
  67  | 
  68  |   // Human-readable summary in the console / CI log.
  69  |   if (violations.length) {
  70  |     const summary = violations
  71  |       .map(v => `  [${v.impact || 'n/a'}] ${v.id} — ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})\n      ${v.helpUrl}`)
  72  |       .join('\n');
  73  |     console.log(`\nA11y violations on "${label}" (${violations.length}):\n${summary}\n`);
  74  |   } else {
  75  |     console.log(`A11y: no WCAG ${WCAG_TAGS.join('/')} violations on "${label}".`);
  76  |   }
  77  | 
  78  |   // Gate: only fail on impact >= FAIL_LEVEL.
  79  |   const blocking = violations.filter(v => (RANK[v.impact] || 0) >= FAIL_RANK);
  80  |   expect(
  81  |     blocking,
  82  |     `${blocking.length} WCAG violation(s) at impact "${FAIL_LEVEL}"+ on "${label}":\n` +
  83  |       blocking.map(v => `  [${v.impact}] ${v.id}: ${v.help}`).join('\n')
> 84  |   ).toEqual([]);
      |     ^ Error: 1 WCAG violation(s) at impact "serious"+ on "barrierefreiheit":
  85  | }
  86  | 
  87  | async function login(page) {
  88  |   await page.goto('/login');
  89  |   await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  90  |   await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  91  |   await page.click('button[type="submit"]');
  92  |   await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
  93  | }
  94  | 
  95  | // ── Public pages — no credentials needed ──────────────────────────────────────
  96  | test.describe('Accessibility — public pages', () => {
  97  |   const publicPages = [
  98  |     { path: '/', label: 'landing-login' },
  99  |     { path: '/pricing', label: 'pricing' },
  100 |     { path: '/Impressum', label: 'impressum' },
  101 |     { path: '/Datenschutz', label: 'datenschutz' },
  102 |     { path: '/agb', label: 'agb' },
  103 |     { path: '/Widerruf', label: 'widerruf' },
  104 |     { path: '/barrierefreiheit', label: 'barrierefreiheit' },
  105 |     { path: '/gobd', label: 'gobd' },
  106 |   ];
  107 | 
  108 |   for (const { path, label } of publicPages) {
  109 |     test(`${label} (${path}) has no serious WCAG violations`, async ({ page }, testInfo) => {
  110 |       test.setTimeout(60_000); // axe + settle/retry can exceed the 30s default
  111 |       await page.goto(path);
  112 |       await checkA11y(page, testInfo, label);
  113 |     });
  114 |   }
  115 | });
  116 | 
  117 | // ── Authenticated pages — the ones Lighthouse-on-dist can't reach ─────────────
  118 | test.describe('Accessibility — authenticated pages', () => {
  119 |   // The accounting/invoice/team pages are the data tables the accessibility
  120 |   // statement explicitly flags (missing ARIA table roles, aria-live).
  121 |   const authPages = [
  122 |     { path: '/dashboard', label: 'dashboard' },
  123 |     { path: '/dashboard/accounting', label: 'accounting' },
  124 |     { path: '/dashboard/accounting/Transaction', label: 'transaction' },
  125 |     { path: '/dashboard/emails', label: 'emails' },
  126 |     { path: '/dashboard/workflow/team', label: 'workflow-team' },
  127 |     { path: '/dashboard/settings', label: 'settings' },
  128 |   ];
  129 | 
  130 |   for (const { path, label } of authPages) {
  131 |     test(`${label} (${path}) has no serious WCAG violations`, async ({ page }, testInfo) => {
  132 |       test.skip(!HAS_CREDS, 'TEST_EMAIL / TEST_PASSWORD not set');
  133 |       test.setTimeout(60_000); // axe + login + settle/retry can exceed the 30s default
  134 |       await login(page);
  135 |       await page.goto(path);
  136 |       await checkA11y(page, testInfo, label);
  137 |     });
  138 |   }
  139 | });
  140 | 
```