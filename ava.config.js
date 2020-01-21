export default {
  // compileEnhancements: false,
  extensions: ['ts'],
  require: [
    // https://github.com/avajs/ava/blob/master/docs/recipes/typescript.md
    'ts-node/register',

    // https://github.com/avajs/ava/blob/master/docs/recipes/browser-testing.md
    './test/helpers/setupBrowserEnv.js',
  ],
};
