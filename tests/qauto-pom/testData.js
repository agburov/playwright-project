// Centralized test data constants for registration scenarios
// Keep only static, reusable values here. No functions.

const TEST_DATA = {
  validUser: {
    name: 'John',
    lastName: 'Tester',
    password: 'Qauto123',
  },
  invalidNames: {
    tooShort: 'A',
    valid: 'John',
  },
  invalidEmails: {
    invalidFormat: 'aqa-invalid-email',
  },
  invalidPasswords: {
    noUppercase: 'qauto123',
    noNumber: 'Qautoabc',
    tooShort: 'Qa1',
  },
  invalidRepeatPasswords: {
    mismatch: 'Qauto124',
  },
};

module.exports = {
  TEST_DATA,
};
