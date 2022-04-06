const OFF = 'off';
const ERROR = 'error';
const WARN = 'warn';
const PRODUCTION = 'production';

module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['import'],
  extends: [
    'airbnb-base',
    'plugin:sonarjs/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === PRODUCTION ? ERROR : WARN,
    'no-debugger': process.env.NODE_ENV === PRODUCTION ? ERROR : WARN,
    'import/no-extraneous-dependencies': OFF,
  },
};
