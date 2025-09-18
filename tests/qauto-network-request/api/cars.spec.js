import { test, expect, request } from '@playwright/test';

async function loginAndGetStorageState(baseURL) {
  const ctx = await request.newContext({ baseURL });
  const resp = await ctx.post('/api/auth/signin', {
    data: {
      email: 'usert@mail.com',
      password: 'Password123',
      remember: false,
    },
  });
  expect(resp.ok()).toBeTruthy();
  const storageState = await ctx.storageState();
  await ctx.dispose();
  return storageState;
}

test.describe('API: POST /api/cars', () => {
  let api;

  test.beforeAll(async ({ playwright, baseURL }) => {
    const storageState = await loginAndGetStorageState(baseURL);
    api = await request.newContext({ baseURL, storageState });
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('positive: create car successfully', async () => {
    const payload = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 12345,
    };

    const res = await api.post('/api/cars', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.data).toMatchObject({
      carBrandId: payload.carBrandId,
      carModelId: payload.carModelId,
      mileage: payload.mileage,
    });

    // cleanup
    const carId = body.data.id ?? body.data.carId ?? body.data._id;
    if (carId) {
      await api.delete(`/api/cars/${carId}`);
    }
  });

  test('negative: missing required field mileage', async () => {
    const payload = {
      carBrandId: 1,
      carModelId: 1,
    };

    const res = await api.post('/api/cars', { data: payload });
    expect([400, 422]).toContain(res.status());
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  test('negative: unauthorized when no auth cookie', async ({ baseURL }) => {
    const anon = await request.newContext({ baseURL });
    const res = await anon.post('/api/cars', {
      data: { carBrandId: 1, carModelId: 1, mileage: 1 },
    });
    expect([401, 403]).toContain(res.status());
    await anon.dispose();
  });
});
