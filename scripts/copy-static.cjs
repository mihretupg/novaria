const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

for (const file of ['script.js']) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
