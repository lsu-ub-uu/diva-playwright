import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const { TARGET_URL = '', CI } = process.env;

export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: CI
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'junit-report.xml' }],
      ]
    : [['list'], ['html']],
  use: {
    baseURL: TARGET_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
