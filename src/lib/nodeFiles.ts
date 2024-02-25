export const files = {
  "index.js": {
    file: {
      contents: `'use strict';
let vm = require('node:vm');
const {readFileSync} = require('node:fs');

function replacer(key, value) {
  if (typeof value === "function") {
    return 'Function';
  }

  if (typeof value === "bigint") {
    return \`\${value}n\`;
  }

  if (typeof value === 'number' && value === Number.POSITIVE_INFINITY) {
    return 'Infinity';
  }

  return value;
}

global.require = require;
const setupCode = readFileSync('./setup.js');
const mainCode = readFileSync('./main.js');
const code = setupCode + '\\n' + mainCode;
const result = vm.runInThisContext(code);
vm = null;

let out; 

if (typeof result === 'string') {
  out = result
} else if (typeof result === 'undefined') {
  out = 'undefined'
} else {
  out = JSON.stringify(result, replacer, 2);
}

process.stdout.write(out);`,
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
