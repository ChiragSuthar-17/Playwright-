import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,                    // Retry failed tests twice in CI
  workers: process.env.CI ? 1 : undefined,   // 1 worker in CI
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['github'],                  // GitHub Actions annotations
    ['list']
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',   // Capture screenshots on failure
    video: 'retain-on-failure',      // Record video on failure
    trace: 'on-first-retry',         // Tracing for debugging
    headless: true,                  // Always headless in CI
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
  ],
});
