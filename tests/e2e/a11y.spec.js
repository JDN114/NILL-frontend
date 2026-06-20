import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/*
 * Accessibility (BFSG / WCAG 2.1 AA) automated checks.
 *
 * Why this exists: the Lighthouse CI job scans `./dist` (the static SPA shell),
 * so it only ever audits the public landing page — never the authenticated
 * accounting / invoice tables that Barrierefreiheit.jsx flags as not yet
 * conformant. These Playwright specs log in and run axe-core against the real
 * pages, including the ones behind auth.
 *
 * axe-core only covers the automatable subset of WCAG (~30-40%); a passing run
 * is NOT a full WCAG audit, but it catches the regressions that machines can.
 */

const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);

// WCAG 2.0 + 2.1, levels A and AA — the BFSG-relevant scope.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// Which impact levels fail the build. axe levels: minor < moderate < serious < critical.
// Default fails on serious+critical (the ones that actually block users such as
// screen-reader-broken tables and missing names); moderate/minor are reported only.
const FAIL_LEVEL = process.env.A11Y_FAIL_LEVEL || 'serious';
const RANK = { minor: 1, moderate: 2, serious: 3, critical: 4 };
const FAIL_RANK = RANK[FAIL_LEVEL] || RANK.serious;

/**
 * Run axe on the current page, attach a full report, log a summary, and assert
 * there are no violations at or above FAIL_LEVEL.
 */
async function checkA11y(page, testInfo, label) {
  // Cross-origin iframes (e.g. itrk.legal legal docs) can't be analysed by axe
  // and aren't ours to fix — exclude them so they don't add noise.
  //
  // SPAs perform client-side redirects/route normalisation after mount, which
  // can destroy the execution context mid-scan. Let the page settle, then retry
  // the analysis a couple of times if a navigation races the injected axe run.
  let results;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1200); // let post-mount redirects settle
      results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .exclude('iframe')
        .analyze();
      break;
    } catch (err) {
      const racing = /execution context was destroyed|navigation|frame was detached/i.test(err.message);
      if (racing && attempt < 3) {
        await page.waitForTimeout(1500);
        continue;
      }
      throw err;
    }
  }

  const violations = results.violations;

  // Attach the raw report to the Playwright HTML report for triage.
  await testInfo.attach(`axe-${label}.json`, {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });

  // Human-readable summary in the console / CI log.
  if (violations.length) {
    const summary = violations
      .map(v => `  [${v.impact || 'n/a'}] ${v.id} — ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})\n      ${v.helpUrl}`)
      .join('\n');
    console.log(`\nA11y violations on "${label}" (${violations.length}):\n${summary}\n`);
  } else {
    console.log(`A11y: no WCAG ${WCAG_TAGS.join('/')} violations on "${label}".`);
  }

  // Gate: only fail on impact >= FAIL_LEVEL.
  const blocking = violations.filter(v => (RANK[v.impact] || 0) >= FAIL_RANK);
  expect(
    blocking,
    `${blocking.length} WCAG violation(s) at impact "${FAIL_LEVEL}"+ on "${label}":\n` +
      blocking.map(v => `  [${v.impact}] ${v.id}: ${v.help}`).join('\n')
  ).toEqual([]);
}

async function login(page) {
  await page.goto('/');
  await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
}

// ── Public pages — no credentials needed ──────────────────────────────────────
test.describe('Accessibility — public pages', () => {
  const publicPages = [
    { path: '/', label: 'landing-login' },
    { path: '/pricing', label: 'pricing' },
    { path: '/Impressum', label: 'impressum' },
    { path: '/Datenschutz', label: 'datenschutz' },
    { path: '/agb', label: 'agb' },
    { path: '/Widerruf', label: 'widerruf' },
    { path: '/barrierefreiheit', label: 'barrierefreiheit' },
    { path: '/gobd', label: 'gobd' },
  ];

  for (const { path, label } of publicPages) {
    test(`${label} (${path}) has no serious WCAG violations`, async ({ page }, testInfo) => {
      test.setTimeout(60_000); // axe + settle/retry can exceed the 30s default
      await page.goto(path);
      await checkA11y(page, testInfo, label);
    });
  }
});

// ── Authenticated pages — the ones Lighthouse-on-dist can't reach ─────────────
test.describe('Accessibility — authenticated pages', () => {
  // The accounting/invoice/team pages are the data tables the accessibility
  // statement explicitly flags (missing ARIA table roles, aria-live).
  const authPages = [
    { path: '/dashboard', label: 'dashboard' },
    { path: '/dashboard/accounting', label: 'accounting' },
    { path: '/dashboard/accounting/Transaction', label: 'transaction' },
    { path: '/dashboard/emails', label: 'emails' },
    { path: '/dashboard/workflow/team', label: 'workflow-team' },
    { path: '/dashboard/settings', label: 'settings' },
  ];

  for (const { path, label } of authPages) {
    test(`${label} (${path}) has no serious WCAG violations`, async ({ page }, testInfo) => {
      test.skip(!HAS_CREDS, 'TEST_EMAIL / TEST_PASSWORD not set');
      test.setTimeout(60_000); // axe + login + settle/retry can exceed the 30s default
      await login(page);
      await page.goto(path);
      await checkA11y(page, testInfo, label);
    });
  }
});
