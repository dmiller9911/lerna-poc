const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');

rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './rules');

module.exports = {
  plugins: ['rulesdir', 'import'],
  rules: {
    'rulesdir/import-default-name': [
      'error',
      {
        classnames: 'classNames',
        'prop-types': 'PropTypes'
      }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ],
    'import/no-named-default': 'off',
    'import/prefer-default-export': 'off'
  }
};
