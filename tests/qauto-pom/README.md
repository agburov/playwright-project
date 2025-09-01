# Registration Tests with Page Object Model

## Structure

```
qauto-pom/
├── pages/
│   ├── BasePage.js          # Base page object with common methods
│   └── RegistrationPage.js  # Registration page object
├── utils/
│   └── testData.js          # Test data utilities
├── registration.spec.js     # Main test file
└── README.md
```

## Components

- **BasePage.js** - Common methods for web pages (navigation, assertions, interactions)
- **RegistrationPage.js** - Registration form specific methods and selectors
- **testData.js** - Email generation and test data constants
- **registration.spec.js** - Test scenarios for registration form

## Run Tests

```bash
npx playwright test tests/qauto-pom/registration.spec.js
```
