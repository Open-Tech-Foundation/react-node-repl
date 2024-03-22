export const files = {
  "index.js": {
    file: {
      contents: `'use strict';
let vm = require('node:vm');
const {readFileSync} = require('node:fs');
const { formatWithOptions } = require('node:util');

global.require = require;
const setupCode = readFileSync('./setup.js');
const mainCode = readFileSync('./main.js');
const code = setupCode + '\\n' + mainCode;
const result = vm.runInThisContext(code);
vm = null;
process.stdout.write(formatWithOptions({ colors: true, depth: 5 }, result));`,
    },
  },
  "main.js": {
    file: {
      contents: "",
    },
  },
  "setup.js": {
    file: {
      contents: "",
    },
  },
  "package.json": {
    file: {
      contents: `
{
  "name": "react-node-repl",
  "type": "commonjs",
  "dependencies": {},
  "scripts": {
    "start": "node index.js"
  }
}`,
    },
  },
};
