import { defineConfig, devices } from '@playwright/test';

const STAGING_URL = process.env.STAGING_URL || 'http://localhost:5173';

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

  // Skip E2E entirely if no staging URL is configured
  // Tests individually guard with test.skip() when env vars are missing
});
