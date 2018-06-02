module.exports = {
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    browser: true,
  },
  rules: {
    // Function trailing comma is not implemented yet in browsers
    'comma-dangle': ['error', 'always-multiline', {
      functions: 'never'
    }],
    // In browsers ES modules require extensions in paths
    'import/extensions': ['error', 'always'],
  }
};
