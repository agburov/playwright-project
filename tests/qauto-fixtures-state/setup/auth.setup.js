import { test as setup, expect } from '@playwright/test';
import { TEST_CREDENTIALS } from '../config/credentials.js';

const authFile = 'tests/qauto-fixtures-state/playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Click Sign In button
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForLoadState('domcontentloaded');

  // Fill login form
  await page.locator('#signinEmail').fill(TEST_CREDENTIALS.email);
  await page.locator('#signinPassword').fill(TEST_CREDENTIALS.password);

  // Submit login form
  await page.getByRole('button', { name: /login/i }).click();

  // Wait for redirect to garage page
  await expect(page).toHaveURL(/.*\/panel\/garage/);
  await expect(page.getByRole('heading', { name: 'Garage' })).toBeVisible();

  // Save signed-in state to 'playwright/.auth/user.json'
  await page.context().storageState({ path: authFile });
});
