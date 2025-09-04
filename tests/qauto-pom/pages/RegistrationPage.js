const BasePage = require('./BasePage.js');
const { expect } = require('@playwright/test');

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.selectors = {
      name: '#signupName',
      lastName: '#signupLastName',
      email: '#signupEmail',
      password: '#signupPassword',
      repeat: '#signupRepeatPassword',
      registerBtn: /register/i,
      signUpBtn: /sign up/i,
      title: /^Registration$/,
    };

    // Messages
    this.messages = {
      title: /^Registration$/,
      requiredName: 'Name required',
      requiredLastName: 'Last name required',
      requiredEmail: 'Email required',
      requiredPassword: 'Password required',
      nameLength: /name has to be from 2 to 20 characters long/i,
      emailInvalid: /email is incorrect/i,
      passwordComplexity:
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
      mismatch: /passwords do not match/i,
      successAny: /registration successful|garage/i,
      userExists: /user already exists/i,
    };
  }

  // Navigation methods
  async openRegistrationForm() {
    await this.clickByRole('button', this.selectors.signUpBtn);
    await this.waitForElement(this.selectors.name);
  }

  // Form interaction methods
  async fillName(name) {
    await this.fillField(this.selectors.name, name);
  }

  async fillLastName(lastName) {
    await this.fillField(this.selectors.lastName, lastName);
  }

  async fillEmail(email) {
    await this.fillField(this.selectors.email, email);
  }

  async fillPassword(password) {
    await this.fillField(this.selectors.password, password);
  }

  async fillRepeatPassword(password) {
    await this.fillField(this.selectors.repeat, password);
  }

  async submitForm() {
    await this.clickByRole('button', this.selectors.registerBtn);
  }

  // Form validation methods
  async triggerFieldValidation(fieldSelector) {
    await this.focusField(fieldSelector);
    await this.blurField(fieldSelector);
  }

  async triggerAllFieldsValidation() {
    const fields = [
      this.selectors.name,
      this.selectors.lastName,
      this.selectors.email,
      this.selectors.password,
      this.selectors.repeat,
    ];

    for (const field of fields) {
      await this.triggerFieldValidation(field);
    }
  }

  // Assertion methods
  async expectTitleVisible() {
    await this.expectTextVisible(this.messages.title);
  }

  async expectFieldVisible(selector) {
    await this.expectElementVisible(selector);
  }

  async expectMessageVisible(message, options = {}) {
    if (typeof message === 'string') {
      await expect(this.page.getByText(message, options).first()).toBeVisible();
    } else {
      await this.expectTextVisible(message, options);
    }
  }

  async expectSuccessMessage(timeout = 10000) {
    await expect(this.page.getByText(this.messages.successAny).first()).toBeVisible({ timeout });
  }

  async expectUserExistsMessage(timeout = 10000) {
    await expect(this.page.getByText(this.messages.userExists)).toBeVisible({ timeout });
  }

  // Utility methods
  async fillRegistrationForm(data) {
    const { name, lastName, email, password, repeatPassword = password } = data;

    if (name) await this.fillName(name);
    if (lastName) await this.fillLastName(lastName);
    if (email) await this.fillEmail(email);
    if (password) await this.fillPassword(password);
    if (repeatPassword) await this.fillRepeatPassword(repeatPassword);
  }

  async completeRegistration(data) {
    await this.fillRegistrationForm(data);
    await this.submitForm();
  }
}

module.exports = RegistrationPage;
