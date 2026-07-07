import { defineConfig, devices } from '@playwright/test';

// Only treat STAGING_URL as a real external target when it points at a remote
// host. An empty value or a localhost placeholder (CI often injects
// vars.STAGING_URL = http://localhost:5173) must NOT disable the local
// webServer — otherwise nothing serves the app and every test fails with
// net::ERR_CONNECTION_REFUSED.
const RAW_STAGING_URL = (process.env.STAGING_URL || '').trim();
const EXTERNAL_URL =
  RAW_STAGING_URL && !/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(RAW_STAGING_URL)
    ? RAW_STAGING_URL
    : undefined;
const STAGING_URL = EXTERNAL_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.js'],

  // Timeout per test
  timeout: 30_000,

  // Retry failed tests once in CI
  retries: process.env.CI ? 1 : 0,

  // Run tests in parallel — faster in CI, but keep serial for visual regression
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,

  // Output
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['github'],  // annotates GitHub Actions with test failures
  ],

  use: {
    baseURL: STAGING_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Ignore HTTPS cert errors on staging
    ignoreHTTPSErrors: true,

    // Realistic viewport
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // When a real (remote) STAGING_URL is provided, tests run against it
  // directly. Otherwise — including when STAGING_URL is empty or a localhost
  // placeholder — Playwright builds the app and serves it locally so there is
  // always a target — vite preview defaults to 4173, so pin 5173 to match
  // the baseURL fallback above.
  webServer: EXTERNAL_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port 5173 --strictPort',
        url: 'http://localhost:5173',
        // build alone is ~80s; leave generous headroom for a cold CI runner
        timeout: 240_000,
        reuseExistingServer: !process.env.CI,
      },

  // Tests individually guard with test.skip() when credential env vars are missing
});
