const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // Common navigation methods
  async goto(url = '/') {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Common wait methods
  async waitForElement(selector, options = {}) {
    await this.page.waitForSelector(selector, options);
  }

  async waitForText(text, options = {}) {
    await this.page.waitForSelector(`text=${text}`, options);
  }

  // Common assertion methods
  async expectElementVisible(selector, options = {}) {
    await expect(this.page.locator(selector)).toBeVisible(options);
  }

  async expectTextVisible(text, options = {}) {
    await expect(this.page.getByText(text, options)).toBeVisible();
  }

  // Common interaction methods
  async clickElement(selector) {
    await this.page.locator(selector).click();
  }

  async clickByRole(role, name) {
    await this.page.getByRole(role, { name }).click();
  }

  async fillField(selector, value) {
    await this.page.locator(selector).fill(value);
  }

  async focusField(selector) {
    await this.page.locator(selector).focus();
  }

  async blurField(selector) {
    await this.page.locator(selector).blur();
  }

  // Common utility methods
  async getText(selector) {
    return await this.page.locator(selector).textContent();
  }

  async isElementVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }
}

module.exports = BasePage;
