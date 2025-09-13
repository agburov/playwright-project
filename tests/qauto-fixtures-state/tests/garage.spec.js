import { test, expect } from '../fixtures/userGaragePage.js';

test.describe('Garage Page Tests with Fixtures', () => {
  test('User can view garage page after login', async ({ userGaragePage }) => {
    // Verify user is logged in and on garage page
    await userGaragePage.expectPageLoaded();

    // Verify page elements are visible
    await userGaragePage.expectElementVisible('button:has-text("Add car")');
  });

  test('User can navigate to different sections', async ({ userGaragePage }) => {
    // Test navigation to fuel expenses
    await userGaragePage.clickFuelExpenses();
    await expect(userGaragePage.page).toHaveURL(/.*\/panel\/expenses/);

    // Navigate back to garage
    await userGaragePage.goto('/panel/garage');
    await userGaragePage.expectPageLoaded();

    // Test navigation to instructions
    await userGaragePage.clickInstructions();
    await expect(userGaragePage.page).toHaveURL(/.*\/panel\/instructions/);
  });

  test('User can open add car form', async ({ userGaragePage }) => {
    await userGaragePage.expectPageLoaded();

    // Click Add Car button
    await userGaragePage.clickAddCar();

    // Verify form elements are visible
    await userGaragePage.expectElementVisible('#addCarBrand');
    await userGaragePage.expectElementVisible('#addCarModel');
    await userGaragePage.expectElementVisible('#addCarMileage');
  });

  test('User can add a new car to garage', async ({ userGaragePage }) => {
    // Get initial car count
    const initialCarCount = await userGaragePage.getCarCount();

    // Add new car
    const carData = {
      brand: { index: 1 }, // Select first available brand
      model: { index: 1 }, // Select first available model
      mileage: '10000',
    };

    await userGaragePage.addNewCar(carData);

    // Wait for car to be added (check for success message or car count change)
    try {
      await userGaragePage.expectCarAdded();
    } catch (error) {
      // If no success message, wait for car count to change
      await userGaragePage.page.waitForFunction(
        (initialCount) => {
          const carItems = document.querySelectorAll('.car-item');
          return carItems.length > initialCount;
        },
        initialCarCount,
        { timeout: 10000 },
      );
    }

    // Verify car count increased
    const newCarCount = await userGaragePage.getCarCount();
    expect(newCarCount).toBeGreaterThan(initialCarCount);
  });

  test('User can logout from garage page', async ({ userGaragePage }) => {
    // Click logout
    await userGaragePage.clickLogout();

    // Verify redirected to login page
    await expect(userGaragePage.page).toHaveURL(/.*\/$/);
    await expect(userGaragePage.page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
