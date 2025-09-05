// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load env from project root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  testDir: '../qauto-pom',
  outputDir: '../../test-results',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Do normalization of the baseURL to avoid trailing slash error when using the baseURL in the tests
    baseURL: `${process.env.BASE_URL?.replace(/\/$/, '')}`,
    httpCredentials:
      process.env.HTTP_USER && process.env.HTTP_PASSWORD
        ? { username: process.env.HTTP_USER, password: process.env.HTTP_PASSWORD }
        : undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
