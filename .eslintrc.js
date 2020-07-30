module.exports = {
  env: {
    browser: true,
    es6: true,
    node: 1,
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['vue'],
  rules: {
    quotes: [2, 'single', 'avoid-escape'],
  },
};
