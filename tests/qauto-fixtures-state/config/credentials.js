// Test credentials configuration
// Copy .env_example to .env and update with your credentials

// Load environment variables from .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Validate that required environment variables are set
const requiredEnvVars = ['TEST_USER_EMAIL', 'TEST_USER_PASSWORD', 'BASE_URL'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please copy .env_example to .env and set the required values.',
  );
}

const TEST_CREDENTIALS = {
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
  baseUrl: process.env.BASE_URL,
};

module.exports = {
  TEST_CREDENTIALS,
};
