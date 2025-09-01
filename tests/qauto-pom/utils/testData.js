const EMAIL_PREFIX = 'aqa';

// Generate unique, readable email for auto-tests
function generateUniqueEmail(prefix = EMAIL_PREFIX) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${random}@test.com`;
}

// Test data constants
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
  generateUniqueEmail,
  TEST_DATA,
};
