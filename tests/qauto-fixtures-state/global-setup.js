const { chromium } = require('@playwright/test');
const { TEST_CREDENTIALS } = require('./config/credentials.js');

async function globalSetup(config) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to login page
    await page.goto(baseURL);
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
    await page.waitForURL(/.*\/panel\/garage/);
    await page.waitForLoadState('domcontentloaded');

    // Wait for garage page to load completely
    await page.waitForSelector('h1:has-text("Garage")');

    // Save signed-in state
    await page
      .context()
      .storageState({ path: 'tests/qauto-fixtures-state/playwright/.auth/user.json' });
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
