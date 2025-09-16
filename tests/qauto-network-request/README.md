# QAuto Network & API Requests

## Structure

```
qauto-network-request/
├── playwright.config.js          # Local config with UI and API projects
├── ui/
│   └── profile-intercept.spec.js # Intercept /api/users/profile and verify UI
└── api/
    └── cars.spec.js              # API tests for POST /api/cars
```

## How to run

### Run UI interception test

```bash
npx playwright test --config=tests/qauto-network-request/playwright.config.js --project=ui
```

### Run API tests

```bash
npx playwright test --config=tests/qauto-network-request/playwright.config.js --project=api
```

## Notes

- UI test logs in as the provided user and intercepts `GET /api/users/profile`, fulfilling with mocked `name` and `lastName`, then checks the Profile page shows them.
- API tests authenticate via `POST /api/auth/signin` and reuse cookies for `POST /api/cars`:
  - 1 positive creation test (with cleanup delete if id returned)
  - 2 negative tests: missing `mileage`, and unauthorized without auth
