/* eslint-disable no-console */

const tool = process.argv[2];

function outputGlobForPackages(packages) {
  const ignoreglob = `{${packages.join(',')}}`;
  console.log(ignoreglob);
}

function getBabelGlobPackages() {
  const babelENV = process.env.BABEL_ENV || 'production:cjs';
  const allIgnore = [
    '@dm-lerna-poc/eslint-config-lerna-poc',
    '@dm-lerna-poc/codemods'
  ];
  const ignoreMap = {
    esm: [...allIgnore],
    cjs: [...allIgnore]
  };
  const moduleType = babelENV.split(':')[1];
  outputGlobForPackages(ignoreMap[moduleType]);
}

switch (tool) {
  case 'babel':
    getBabelGlobPackages();
    break;
  default:
    console.log('');
}
