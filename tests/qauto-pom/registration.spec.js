import { test, expect } from '@playwright/test';
import RegistrationPage from './pages/RegistrationPage.js';
import { generateUniqueEmail } from './utils/email.js';
import { TEST_DATA } from './testData.js';

test.describe('Registration form - qauto with POM', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.openRegistrationForm();
    await registrationPage.expectTitleVisible();
    await registrationPage.expectFieldVisible(registrationPage.selectors.name);
  });

  test('Positive: successful registration with valid data', async ({ page }) => {
    const email = generateUniqueEmail();
    const userData = {
      ...TEST_DATA.validUser,
      email,
    };

    await registrationPage.completeRegistration(userData);
    await registrationPage.expectSuccessMessage();
  });

  test('Negative: empty required fields show required errors', async ({ page }) => {
    await registrationPage.triggerAllFieldsValidation();

    await registrationPage.expectMessageVisible(registrationPage.messages.requiredName, {
      exact: true,
    });
    await registrationPage.expectMessageVisible(registrationPage.messages.requiredLastName, {
      exact: true,
    });
    await registrationPage.expectMessageVisible(registrationPage.messages.requiredEmail, {
      exact: true,
    });
    await registrationPage.expectMessageVisible(registrationPage.messages.requiredPassword, {
      exact: true,
    });
  });

  test('Negative: name too short shows length error', async ({ page }) => {
    const email = generateUniqueEmail();
    const userData = {
      name: TEST_DATA.invalidNames.tooShort,
      lastName: TEST_DATA.validUser.lastName,
      email,
      password: TEST_DATA.validUser.password,
    };

    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.triggerFieldValidation(registrationPage.selectors.name);

    await registrationPage.expectMessageVisible(registrationPage.messages.nameLength);
  });

  test('Negative: invalid email format', async ({ page }) => {
    const userData = {
      name: TEST_DATA.validUser.name,
      lastName: TEST_DATA.validUser.lastName,
      email: TEST_DATA.invalidEmails.invalidFormat,
      password: TEST_DATA.validUser.password,
    };

    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.triggerFieldValidation(registrationPage.selectors.email);

    await registrationPage.expectMessageVisible(registrationPage.messages.emailInvalid);
  });

  test('Negative: password without uppercase letter fails complexity', async ({ page }) => {
    const email = generateUniqueEmail();
    const userData = {
      name: TEST_DATA.validUser.name,
      lastName: TEST_DATA.validUser.lastName,
      email,
      password: TEST_DATA.invalidPasswords.noUppercase,
    };

    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.triggerFieldValidation(registrationPage.selectors.password);

    await registrationPage.expectMessageVisible(registrationPage.messages.passwordComplexity);
  });

  test('Negative: passwords mismatch', async ({ page }) => {
    const email = generateUniqueEmail();
    const userData = {
      name: TEST_DATA.validUser.name,
      lastName: TEST_DATA.validUser.lastName,
      email,
      password: TEST_DATA.validUser.password,
      repeatPassword: TEST_DATA.invalidRepeatPasswords.mismatch,
    };

    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.triggerFieldValidation(registrationPage.selectors.repeat);

    await registrationPage.expectMessageVisible(registrationPage.messages.mismatch);
  });

  test('Negative: duplicate email shows "User already exists"', async ({ page, browser }) => {
    // Step 1: create a user
    const email = generateUniqueEmail();
    const userData = {
      ...TEST_DATA.validUser,
      email,
    };

    await registrationPage.completeRegistration(userData);
    await registrationPage.expectSuccessMessage();

    // Step 2: new context (clean session), try to register again with same email
    const ctx = await browser.newContext();
    const newPage = await ctx.newPage();
    const newRegistrationPage = new RegistrationPage(newPage);

    await newRegistrationPage.goto();
    await newRegistrationPage.openRegistrationForm();
    await newRegistrationPage.expectTitleVisible();

    await newRegistrationPage.completeRegistration(userData);
    await newRegistrationPage.expectUserExistsMessage();

    await ctx.close();
  });
});
