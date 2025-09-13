const BasePage = require('../../qauto-pom/pages/BasePage.js');
const { expect } = require('@playwright/test');

class GaragePage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.selectors = {
      addCarBtn: /add car/i,
      carBrand: '#addCarBrand',
      carModel: '#addCarModel',
      carMileage: '#addCarMileage',
      saveCarBtn: /add/i,
      carItem: '.car-item',
    };

    // Messages
    this.messages = {
      pageTitle: /garage/i,
      carAdded: /car added/i,
    };
  }

  // Navigation methods
  async expectPageLoaded() {
    await this.expectElementVisible('h1:has-text("Garage")');
    await this.page.waitForSelector('button:has-text("Add car")');
  }

  // Car management methods
  async clickAddCar() {
    await this.clickByRole('button', this.selectors.addCarBtn);
  }

  async fillCarBrand(brand) {
    await this.page.locator(this.selectors.carBrand).selectOption(brand);
  }

  async fillCarModel(model) {
    await this.page.locator(this.selectors.carModel).selectOption(model);
  }

  async fillCarMileage(mileage) {
    await this.fillField(this.selectors.carMileage, mileage);
  }

  async saveCar() {
    await this.clickByRole('button', this.selectors.saveCarBtn);
    // Wait for form to close or success message
    await this.page.waitForFunction(
      () => {
        const form = document.querySelector('#addCarForm');
        return !form || form.style.display === 'none' || form.offsetParent === null;
      },
      { timeout: 5000 },
    );
  }

  async updateCar() {
    await this.clickByRole('button', this.selectors.updateCarBtn);
    // Wait for form to close or success message
    await this.page.waitForFunction(
      () => {
        const form = document.querySelector('#addCarForm');
        return !form || form.style.display === 'none' || form.offsetParent === null;
      },
      { timeout: 5000 },
    );
  }

  async addNewCar(carData) {
    const { brand, model, mileage } = carData;

    await this.clickAddCar();
    await this.fillCarBrand(brand);

    // Wait for model options to load after brand selection
    await this.page.waitForSelector('#addCarModel:not([disabled])');

    await this.fillCarModel(model);
    await this.fillCarMileage(mileage);
    await this.saveCar();
  }

  // Car list methods
  async getCarCount() {
    const cars = await this.page.locator(this.selectors.carItem).all();
    return cars.length;
  }

  // Assertion methods
  async expectCarAdded() {
    await this.expectTextVisible(this.messages.carAdded);
  }

  // Navigation menu methods
  async clickFuelExpenses() {
    await this.page
      .getByRole('link', { name: /fuel expenses/i })
      .first()
      .click();
  }

  async clickInstructions() {
    await this.page
      .getByRole('link', { name: /instructions/i })
      .first()
      .click();
  }

  async clickLogout() {
    // First click on "My profile" dropdown
    await this.page.getByRole('button', { name: /my profile/i }).click();

    // Then click on "Logout" button in the dropdown
    await this.page.getByRole('button', { name: /logout/i }).click();
  }
}

module.exports = GaragePage;
