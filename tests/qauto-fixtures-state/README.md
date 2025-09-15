# Garage Tests with Fixtures and Storage State

## Structure

```
qauto-fixtures-state/
├── fixtures/
│   └── userGaragePage.js        # Custom fixture for authenticated garage page
├── pages/
│   └── GaragePage.js            # Garage page object model
├── setup/
│   └── auth.setup.js            # Authentication setup script
├── tests/
│   └── garage.spec.js           # Test scenarios using fixtures
├── playwright.config.js         # Main test configuration
├── playwright.setup.config.js   # Setup configuration
├── global-setup.js              # Global setup for authentication
└── README.md
```

## Components

- **userGaragePage fixture** - Custom fixture that provides pre-authenticated garage page
- **GaragePage.js** - Page Object Model for garage functionality
- **auth.setup.js** - Setup script for user authentication and storage state
- **global-setup.js** - Global setup that runs before all tests
- **garage.spec.js** - Test scenarios using the custom fixture

## How it works

1. **Global Setup**: Runs before all tests, logs in user and saves authentication state
2. **Custom Fixture**: Creates authenticated browser context using saved storage state
3. **Tests**: Use the fixture to get pre-authenticated garage page

## Prerequisites

1. **Install dependencies:**

   ```bash
   npm install dotenv
   ```

2. **Setup environment:**

   ```bash
   cp .env_example .env
   # Edit .env with your credentials
   ```

3. **Configure credentials in `.env`:**
   ```env
   TEST_USER_EMAIL=YOU_USER_EMAIL
   TEST_USER_PASSWORD=YOUR_USER_PASSWORD
   BASE_URL=URL_WITH_BASIC_AUTH
   ```

## Run Tests

### First time setup:

Run authentication setup to create session data:

```bash
npx playwright test --config=tests/qauto-fixtures-state/playwright.setup.config.js
```

This creates `playwright/.auth/user.json` with your session data.

### Run main tests:

```bash
npx playwright test --config=tests/qauto-fixtures-state/playwright.config.js
```

### Run specific test:

```bash
npx playwright test tests/qauto-fixtures-state/tests/garage.spec.js --config=tests/qauto-fixtures-state/playwright.config.js
```

**Security Note**:

- The `.env` file contains sensitive credentials and should never be committed to version control
- The `playwright/.auth/` directory contains session tokens and cookies - also excluded from git
- Only `.env_example` and `.gitignore` should be tracked in git

### Test Data

- **User credentials**: `usert@mail.com` / `Password123`
- **Base URL**: https://guest:welcome2qauto@qauto.forstudy.space
- **Garage URL**: https://guest:welcome2qauto@qauto.forstudy.space/panel/garage

## Features Tested

- User authentication and session persistence
- Adding new cars to garage
- Opening add car form
- Navigation between different sections
- User logout functionality

## Best Practices Implemented

### Wait Strategies

- **Element-based waits**: `waitForSelector()`, `waitForFunction()`
- **State-based waits**: Waiting for form to close, elements to be enabled
- **No hard timeouts**: Replaced `waitForTimeout()` with meaningful waits
- **Conditional waits**: Try-catch blocks for optional elements

### Examples of Good Waits

```javascript
// Wait for element to be enabled
await page.waitForSelector('#addCarModel:not([disabled])');

// Wait for function condition
await page.waitForFunction((initialCount) => {
  const carItems = document.querySelectorAll('.car-item');
  return carItems.length > initialCount;
}, initialCarCount);

// Wait for form to close
await page.waitForFunction(() => {
  const form = document.querySelector('#addCarForm');
  return !form || form.style.display === 'none';
});
```
