const inquirer = require('inquirer');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const Repository = require('lerna/lib/Repository');
const PackageUtilities = require('lerna/lib/PackageUtilities');

const namespace = '@dougmiller';

const packageTypes = {
  component: 'component',
  pattern: 'pattern',
  layout: 'layout',
  util: 'util',
  build: 'build tool'
};

const basePackageDir = path.resolve(process.cwd(), './packages');
const pathsByPackageType = {
  [packageTypes.component]: path.join(basePackageDir, 'components'),
  [packageTypes.pattern]: path.join(basePackageDir, 'patterns'),
  [packageTypes.util]: path.join(basePackageDir, 'utils'),
  [packageTypes.layout]: path.join(basePackageDir, 'layouts'),
  [packageTypes.build]: path.join(process.cwd(), 'build')
};

(async () => {
  const answers = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: 'What type of package are your wanting to generate?',
      choices: Object.values(packageTypes)
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
        const matchingPkg = packages.find(pkg => {
          return pkg.name.toLowerCase() === input.toLowerCase() + '-lerna';
        });
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
  await createPackageJson(answers.name, destinationDirectory, answers.type);
})();

function createSrcDirectory(dir) {
  return new Promise(resolve => {
    mkdirp(path.join(dir, 'src'), () => {
      resolve();
    });
  });
}

function createPackageJson(name, dir, type) {
  const packageJson = {
    name: name + '-lerna', //remove later
    version: '0.0.0',
    main: './dist/cjs/index.js',
    module: './dist/cjs/index.js',
    'patternfly:src': './src/index.js', //will be used for jest resolver
    sideEffects: false,
    license: 'MIT',
    files: ['./dist'],
    scripts: {},
    publishConfig: {
      access: 'public'
    },
    dependencies: {},
    devDependencies: {},
    peerDependencies: {}
  };

  switch (type) {
    case packageTypes.component:
    case packageTypes.pattern:
    case packageTypes.layout:
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
      break;
  }

  return new Promise(resolve => {
    fs.writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      () => {
        resolve();
      }
    );
  });
}
