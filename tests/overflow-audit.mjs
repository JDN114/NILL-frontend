/**
 * Mobile/Tablet horizontal-overflow auditor.
 * Logs in (HttpOnly cookie auth), then for each viewport width visits each
 * route and reports every element wider than the viewport — the root cause of
 * "side room + pinch/pan" feel. Device-agnostic: we sweep many widths.
 *
 * Run:  NILL_EMAIL=.. NILL_PASS=.. BASE=http://localhost:5173 node tests/overflow-audit.mjs
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:5173';
const EMAIL = process.env.NILL_EMAIL;
const PASS = process.env.NILL_PASS;

// Representative breakpoints: tiny phone → large phone → tablet portrait/landscape
const WIDTHS = [320, 360, 390, 414, 430, 768, 834, 1024];

const ROUTES = [
  '/dashboard',
  '/dashboard/emails',
  '/dashboard/calendar',
  '/dashboard/accounting',
  '/dashboard/workflow',
  '/dashboard/workflow/tasks',
  '/dashboard/workflow/team',
  '/dashboard/settings',
  '/station',
  '/ausweis',
];

const DETECTOR = `(() => {
  const vw = document.documentElement.clientWidth;
  const docW = document.documentElement.scrollWidth;
  const out = [];
  if (docW > vw + 1) {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // element pokes past the right edge OR is itself wider than viewport
      if (r.right > vw + 1 || r.width > vw + 1) {
        const cs = getComputedStyle(el);
        // only report the *innermost* offenders (no offending child)
        out.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || '',
          id: el.id || '',
          right: Math.round(r.right),
          width: Math.round(r.width),
          pos: cs.position,
          ws: cs.whiteSpace,
        });
      }
    }
  }
  return { vw, docW, over: docW - vw, offenders: out };
})()`;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // --- login ---
  if (EMAIL && PASS) {
    await page.goto(BASE + '/login');
    await page.fill('input[type="email"], input[name="email"]', EMAIL);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|station|ausweis|onboarding)/, { timeout: 20000 }).catch(() => {});
    console.log('Logged in, url =', page.url());
  } else {
    console.log('No creds — auditing public routes only.');
  }

  const report = {};
  for (const route of ROUTES) {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(400);
      const res = await page.evaluate(DETECTOR);
      if (res.over > 1) {
        const key = route + ' @' + w;
        // dedupe offenders by tag+cls, keep widest
        const seen = new Map();
        for (const o of res.offenders) {
          const k = o.tag + '|' + o.cls + '|' + o.id;
          if (!seen.has(k) || seen.get(k).width < o.width) seen.set(k, o);
        }
        report[key] = { over: res.over, vw: res.vw, docW: res.docW, offenders: [...seen.values()].slice(0, 8) };
      }
    }
  }

  console.log('\n================ OVERFLOW REPORT ================');
  const keys = Object.keys(report);
  if (!keys.length) {
    console.log('No horizontal overflow detected on any route/width. ✅');
  } else {
    for (const k of keys) {
      const r = report[k];
      console.log(`\n${k}  → docW ${r.docW} > vw ${r.vw}  (overflow ${r.over}px)`);
      for (const o of r.offenders) {
        console.log(`   <${o.tag}${o.id ? '#' + o.id : ''} class="${String(o.cls).slice(0, 60)}"> right=${o.right} w=${o.width} pos=${o.pos} ws=${o.ws}`);
      }
    }
  }
  console.log('\n================================================');
  await browser.close();
})();
