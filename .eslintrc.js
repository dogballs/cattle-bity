module.exports = {
  "extends": "airbnb-base",
  "parserOptions": {
    "ecmaVersion": 6,
  },
  "env": {
    "browser": true,
  },
  "rules": {
    // In browsers ES modules require extensions in paths
    "import/extensions": ["error", "always"]
  }
};
