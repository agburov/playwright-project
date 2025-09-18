import { test, expect } from '@playwright/test';

test.describe('Profile page - intercept profile API response', () => {
  test('should display mocked name and lastName from /api/users/profile', async ({ page }) => {
    const mockedProfile = {
      status: 'ok',
      data: {
        userId: 254811,
        photoFilename: 'default-user.png',
        name: 'Ivan',
        lastName: 'Petrenko',
      },
    };

    await page.route('**/api/users/profile', async (route) => {
      const original = await route.fetch();
      const originalBody = await original.json();

      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...originalBody, ...mockedProfile }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.locator('#signinEmail').fill('usert@mail.com');
    await page.locator('#signinPassword').fill('Password123');
    await page.getByRole('button', { name: /login/i }).click();

    await page.getByRole('link', { name: /profile/i }).click();

    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByText(mockedProfile.data.name)).toBeVisible();
    await expect(page.getByText(mockedProfile.data.lastName)).toBeVisible();
  });
});
