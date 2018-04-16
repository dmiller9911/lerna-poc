module.exports = {
  extends: ['standard-react', 'standard-jsx', 'prettier/react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react'],
  rules: {
    'react/no-array-index-key': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-uses-vars': 'error',
    'react/no-danger': 'off'
  }
};
