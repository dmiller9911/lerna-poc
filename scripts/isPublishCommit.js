/* eslint-disable no-console */
const { execSync } = require('child_process');
const lernaConfig = require('../lerna.json');

const lastCommit = execSync('git log -1 --oneline').toString();
const parts = lastCommit.split(/\s/);
const message = parts.slice(1).join(' ');

console.log(message.trim() === lernaConfig.command.publish.message.trim());
