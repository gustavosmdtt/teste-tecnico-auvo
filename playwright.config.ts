import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.CONFIG_LOGGED) {
  console.log(`\n[CONFIG] TEST_ENV: ${process.env.TEST_ENV || 'public'}`);
  console.log(`[CONFIG] BASE_URL: ${process.env.BASE_URL}\n`);
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
    baseURL: process.env.BASE_URL,
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
