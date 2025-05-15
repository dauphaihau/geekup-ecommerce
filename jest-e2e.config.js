const base = require('./jest.config.base');

module.exports = {
  ...base,
  rootDir: '.',
  testRegex: '.e2e-test.ts$',
};
