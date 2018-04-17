/* eslint-disable no-console */
const { exec } = require('child_process');

const fixedVersionPackages = new Set([
  '@dm-lerna-poc/charts',
  '@dm-lerna-poc/console-lerna',
  '@dm-lerna-poc/core',
  '@dm-lerna-poc/table'
]);

function getUpdatedPackages() {
  return new Promise(resolve => {
    exec('lerna updated --json', (err, stdio, stderr) => {
      console.log(stderr);
      if (err) {
        return resolve([]);
      }
      return resolve(JSON.parse(stdio));
    });
  });
}

function releasePackages(updatedPackages, forceReleasePackages) {
  return new Promise((resolve, reject) => {
    const command = ['lerna publish', '--yes'];
    if (forceReleasePackages) {
      command.push(`--force-publish=${forceReleasePackages.join(',')}`);
    }
    console.log(
      `Packages to Release: \n ${(forceReleasePackages || updatedPackages)
        .map(p => ` - ${p}`)
        .join('\n')}`
    );
    exec(command.join(' '), (err, stderr, stdio) => {
      console.log(stderr);
      console.log(stdio);
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

(async () => {
  try {
    const updatedPackages = await getUpdatedPackages();
    if (!updatedPackages.length) {
      process.exit();
    }

    const hasFixedPackage = updatedPackages.some(p =>
      fixedVersionPackages.has(p.name)
    );

    if (hasFixedPackage) {
      const forceReleases = [
        ...new Set([
          ...fixedVersionPackages.values(),
          ...updatedPackages.map(p => p.name)
        ]).values()
      ];
      await releasePackages(updatedPackages, forceReleases);
    } else {
      await releasePackages(updatedPackages);
    }
    console.log(`\n🚀  📦 Successfully releaseed the packages\n`);
  } catch (err) {
    console.log('\n💥 Failed to release packages\n');
    process.exit(1);
  }
})();
