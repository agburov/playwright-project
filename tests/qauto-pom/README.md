# Registration Tests with Page Object Model

## Structure

```
qauto-pom/
├── pages/
│   ├── BasePage.js          # Base page object with common methods
│   └── RegistrationPage.js  # Registration page object
├── testData.js              # Centralized test data constants
├── utils/
│   └── email.js             # Email generator utility
├── registration.spec.js     # Main test file
└── README.md
```

## Components

- **BasePage.js** - Common methods for web pages (navigation, assertions, interactions)
- **RegistrationPage.js** - Registration form specific methods and selectors
- **testData.js** - Centralized test data constants
- **utils/email.js** - Email generation utility
- **registration.spec.js** - Test scenarios for registration form

## Run Tests

```bash
npx playwright test tests/qauto-pom/registration.spec.js
```
