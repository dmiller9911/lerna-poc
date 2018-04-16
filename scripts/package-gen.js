const inquirer = require('inquirer');
const path = require('path');
const fs = require('./util/fs');
const Repository = require('lerna/lib/Repository');
const PackageUtilities = require('lerna/lib/PackageUtilities');

const namespace = '@dm-lerna-poc';

const packageTypes = {
  package: 'package',
  util: 'util'
};

const basePackageDir = path.resolve(process.cwd(), './packages');
const pathsByPackageType = {
  [packageTypes.package]: path.join(basePackageDir),
  [packageTypes.util]: path.join(basePackageDir, 'utils')
};

async function createSrcDirectory(dir) {
  const srcDir = path.join(dir, 'src');
  await fs.createDirectory(srcDir);
  await fs.writeFile(path.join(srcDir, 'index.js'), '');
}

function createPackageJson(name, dir, type, isReact = false) {
  const packageJson = {
    name,
    version: '0.0.0',
    main: './cjs/index.js',
    module: './esm/index.js',
    'patternfly:src': './src/index.js', // will be used for jest resolver
    sideEffects: false,
    license: 'MIT',
    files: ['./esm', './cjs'],
    scripts: {},
    publishConfig: {
      access: 'public'
    },
    dependencies: {},
    devDependencies: {},
    peerDependencies: {}
  };

  if (isReact) {
    packageJson.peerDependencies = {
      'prop-types': '^15.6.0',
      react: '^15.6.2 || ^16.2.0',
      'react-dom': '^15.6.2 || ^16.2.0'
    };
    packageJson.devDependencies = {
      'prop-types': '^15.6.1',
      react: '^16.3.1',
      'react-dom': '^16.3.1'
    };
  }

  return fs.writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

function createReadME(name, dir) {
  return fs.writeFile(path.join(dir, 'README.md'), `# ${name}`);
}

(async () => {
  const answers = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: 'What type of package are your wanting to generate?',
      choices: Object.values(packageTypes)
    },
    {
      name: 'isReact',
      type: 'confirm',
      message: 'Does this package export React Compoennts?',
      default: true
    },
    {
      name: 'name',
      message: 'What is the package name?',
      filter(input) {
        if (!input) {
          return '';
        }
        const formatted = input.trim().toLowerCase();
        return formatted.startsWith(`${namespace}/`)
          ? formatted
          : `${namespace}/${formatted}`;
      },
      validate: input => {
        if (!input) {
          return 'A package name is required.';
        }
        const packages = PackageUtilities.getPackages(new Repository());
        const matchingPkg = packages.find(
          pkg => pkg.name.toLowerCase() === input.toLowerCase()
        );
        return (
          !matchingPkg ||
          `${input} already exists at ${path.relative(
            process.cwd(),
            matchingPkg.location
          )}`
        );
      }
    }
  ]);
  const packageFolder = answers.name.split(`${namespace}/`)[1];
  const destinationDirectory = path.join(
    pathsByPackageType[answers.type],
    packageFolder
  );
  await createSrcDirectory(destinationDirectory);
  await createPackageJson(
    answers.name,
    destinationDirectory,
    answers.type,
    answers.isReact
  );
  await createReadME(answers.name, destinationDirectory);
})();
