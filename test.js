const { execSync } = require('child_process');

const res = execSync('git log -1 --oneline');
console.log(res.toString());
