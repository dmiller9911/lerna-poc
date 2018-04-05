const { execSync } = require('child_process');

const {
  TRAVIS_PULL_REQUEST,
  TRAVIS_BRANCH,
  NPM_CONFIG_EMAIL,
  GITHUB_USERNAME,
  NPM_TOKEN
} = process.env;

if (TRAVIS_BRANCH === 'master') {
  runCommands(
    `npm config set //yarn/:_authToken=${NPM_TOKEN} -q`,
    `git config --global user.email ${NPM_CONFIG_EMAIL}`,
    `git config --global user.name ${GITHUB_USERNAME}`,
    `git config --global push.default simple`,
    `git checkout ${TRAVIS_BRANCH}`,
    `yarn release:ci`
  );
}

function runCommands(...commands) {
  commands.forEach(command => {
    execSync(command, { stdio: 'inherit' });
  });
}
