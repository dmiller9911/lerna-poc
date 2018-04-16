module.exports = {
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none'
      }
    ]
  },
  extends: ['prettier'],
  plugins: ['prettier']
};
