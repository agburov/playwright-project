// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './setup',
  outputDir: '../../test-results',
  timeout: 30000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'https://guest:welcome2qauto@qauto.forstudy.space',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      testDir: './setup',
    },
  ],
});
