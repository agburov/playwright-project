// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  outputDir: '../../test-results',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://guest:welcome2qauto@qauto.forstudy.space',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },
  projects: [
    {
      name: 'ui',
      testDir: './ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './api',
      use: {},
    },
  ],
});
