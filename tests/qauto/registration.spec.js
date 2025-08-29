import { test, expect } from '@playwright/test';

// Test data
const BASE_URL = '/';
const EMAIL_PREFIX = 'aqa';

// Selectors
const SELECTOR = {
  name: '#signupName',
  lastName: '#signupLastName',
  email: '#signupEmail',
  password: '#signupPassword',
  repeat: '#signupRepeatPassword',
  registerBtn: /register/i,
  signUpBtn: /sign up/i,
};

// Messages
const MSG = {
  title: /^Registration$/,
  requiredName: 'Name required',
  requiredLastName: 'Last name required',
  requiredEmail: 'Email required',
  requiredPassword: 'Password required',
  nameLength: /name has to be from 2 to 20 characters long/i,
  emailInvalid: /email is incorrect/i,
  passwordComplexity:
    /password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter/i,
  mismatch: /passwords do not match/i,
  successAny: /registration successful|garage/i,
  userExists: /user already exists/i,
};

// Generate unique, readable email for auto-tests
function generateUniqueEmail(prefix = EMAIL_PREFIX) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${random}@test.com`;
}

test.describe('Registration form - qauto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: SELECTOR.signUpBtn }).click();
    await expect(page.getByText(MSG.title)).toBeVisible();
    await expect(page.locator(SELECTOR.name)).toBeVisible();
  });

  test('Positive: successful registration with valid data', async ({ page }) => {
    const email = generateUniqueEmail();

    await page.locator(SELECTOR.name).fill('John');
    await page.locator(SELECTOR.lastName).fill('Tester');
    await page.locator(SELECTOR.email).fill(email);
    await page.locator(SELECTOR.password).fill('Qauto123');
    await page.locator(SELECTOR.repeat).fill('Qauto123');

    await page.getByRole('button', { name: SELECTOR.registerBtn }).click();

    await expect(page.getByText(MSG.successAny).first()).toBeVisible({ timeout: 10000 });
  });

  test('Negative: empty required fields show required errors', async ({ page }) => {
    // Trigger blur on each field to show required messages (focus → blur)
    for (const sel of [
      SELECTOR.name,
      SELECTOR.lastName,
      SELECTOR.email,
      SELECTOR.password,
      SELECTOR.repeat,
    ]) {
      await page.locator(sel).focus();
      await page.locator(sel).blur();
    }

    await expect(page.getByText(MSG.requiredName, { exact: true })).toBeVisible();
    await expect(page.getByText(MSG.requiredLastName, { exact: true })).toBeVisible();
    await expect(page.getByText(MSG.requiredEmail, { exact: true })).toBeVisible();
    await expect(page.getByText(MSG.requiredPassword, { exact: true })).toBeVisible();
  });

  test('Negative: name too short shows length error', async ({ page }) => {
    const email = generateUniqueEmail();

    await page.locator(SELECTOR.name).fill('A');
    await page.locator(SELECTOR.lastName).fill('Tester');
    await page.locator(SELECTOR.email).fill(email);
    await page.locator(SELECTOR.password).fill('Qauto123');
    await page.locator(SELECTOR.repeat).fill('Qauto123');

    await page.locator(SELECTOR.name).focus();
    await page.locator(SELECTOR.name).blur();

    await expect(page.getByText(MSG.nameLength)).toBeVisible();
  });

  test('Negative: invalid email format', async ({ page }) => {
    await page.locator(SELECTOR.name).fill('John');
    await page.locator(SELECTOR.lastName).fill('Tester');
    await page.locator(SELECTOR.email).fill('aqa-invalid-email');
    await page.locator(SELECTOR.password).fill('Qauto123');
    await page.locator(SELECTOR.repeat).fill('Qauto123');

    await page.locator(SELECTOR.email).focus();
    await page.locator(SELECTOR.email).blur();

    await expect(page.getByText(MSG.emailInvalid)).toBeVisible();
  });

  test('Negative: password without uppercase letter fails complexity', async ({ page }) => {
    const email = generateUniqueEmail();
    await page.locator(SELECTOR.name).fill('John');
    await page.locator(SELECTOR.lastName).fill('Tester');
    await page.locator(SELECTOR.email).fill(email);
    await page.locator(SELECTOR.password).fill('qauto123');
    await page.locator(SELECTOR.repeat).fill('qauto123');

    await page.locator(SELECTOR.password).focus();
    await page.locator(SELECTOR.password).blur();

    await expect(page.getByText(MSG.passwordComplexity).first()).toBeVisible();
  });

  test('Negative: passwords mismatch', async ({ page }) => {
    const email = generateUniqueEmail();
    await page.locator(SELECTOR.name).fill('John');
    await page.locator(SELECTOR.lastName).fill('Tester');
    await page.locator(SELECTOR.email).fill(email);
    await page.locator(SELECTOR.password).fill('Qauto123');
    await page.locator(SELECTOR.repeat).fill('Qauto124');

    await page.locator(SELECTOR.repeat).focus();
    await page.locator(SELECTOR.repeat).blur();

    await expect(page.getByText(MSG.mismatch)).toBeVisible();
  });

  test('Negative: duplicate email shows "User already exists"', async ({ page, browser }) => {
    // Step 1: create a user
    const email = generateUniqueEmail();
    await page.locator(SELECTOR.name).fill('John');
    await page.locator(SELECTOR.lastName).fill('Tester');
    await page.locator(SELECTOR.email).fill(email);
    await page.locator(SELECTOR.password).fill('Qauto123');
    await page.locator(SELECTOR.repeat).fill('Qauto123');
    await page.getByRole('button', { name: SELECTOR.registerBtn }).click();
    await expect(page.getByText(MSG.successAny).first()).toBeVisible({ timeout: 10000 });

    // Step 2: new context (clean session), try to register again with same email
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(BASE_URL);
    await p.waitForLoadState('domcontentloaded');
    await p.getByRole('button', { name: SELECTOR.signUpBtn }).click();
    await expect(p.getByText(MSG.title)).toBeVisible();

    await p.locator(SELECTOR.name).fill('John');
    await p.locator(SELECTOR.lastName).fill('Tester');
    await p.locator(SELECTOR.email).fill(email);
    await p.locator(SELECTOR.password).fill('Qauto123');
    await p.locator(SELECTOR.repeat).fill('Qauto123');
    await p.getByRole('button', { name: SELECTOR.registerBtn }).click();

    await expect(p.getByText(MSG.userExists)).toBeVisible({ timeout: 10000 });
    await ctx.close();
  });
});
