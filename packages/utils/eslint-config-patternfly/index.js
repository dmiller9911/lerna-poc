module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'babel-eslint',
  extends: ['standard', 'airbnb', './import.js']
};
