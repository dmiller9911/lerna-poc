const fs = require('fs');
const mkdirp = require('mkdirp');

function writeFile(filePath, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, contents, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function createDirectory(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

module.exports = {
  writeFile,
  createDirectory
};
