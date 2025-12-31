import { defineConfig, devices } from '@playwright/test';

if (!process.env.TEST_ENV && !process.env.CI) {
    require('dotenv').config();
}

const getBaseURL = (): string => {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  const testEnv = process.env.TEST_ENV || 'public';

  if (testEnv === 'local') {
    return 'http://localhost:8080/parabank';
  }

  return 'https://parabank.parasoft.com/parabank';
};

const BASE_URL = getBaseURL();
if (!process.env.CONFIG_LOGGED) {
  console.log(`\n[CONFIG] TEST_ENV: ${process.env.TEST_ENV || 'public'}`);
  console.log(`[CONFIG] BASE_URL: ${BASE_URL}\n`);
  process.env.CONFIG_LOGGED = 'true';
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 3,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results/',
});
