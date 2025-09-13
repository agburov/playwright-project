import { test as base, expect } from '@playwright/test';
import GaragePage from '../pages/GaragePage.js';

const authFile = 'tests/qauto-fixtures-state/playwright/.auth/user.json';

// Extend base test by providing "userGaragePage" fixture
export const test = base.extend({
  userGaragePage: async ({ browser }, use) => {
    // Create a new context with the saved authentication state
    const context = await browser.newContext({
      storageState: authFile,
    });

    const page = await context.newPage();
    const garagePage = new GaragePage(page);

    // Navigate to garage page
    await garagePage.goto('/panel/garage');
    await garagePage.expectPageLoaded();

    // Use the fixture value in the test
    await use(garagePage);

    // Cleanup
    await context.close();
  },
});

export { expect } from '@playwright/test';
