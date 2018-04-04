const babelENV = process.env.BABEL_ENV || 'development';
const modules = babelENV !== 'production:esm' ? 'commonjs' : false;

module.exports = {
  presets: [['@babel/preset-env', { modules: modules }], '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ],
  ignore: (() => {
    const ignore = [
      'src/**/__snapshots__',
      'src/**/*.stories.js',
      'src/**/Stories'
    ];
    if (babelENV.includes('production')) {
      ignore.push('test.js', '__mocks__');
    }
    return ignore;
  })()
};
