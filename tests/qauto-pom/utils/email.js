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

module.exports = {
  generateUniqueEmail,
};
