export const files = {
  "index.js": {
    file: {
      contents: `'use strict';
let vm = require('node:vm');
const {readFileSync} = require('node:fs');

const code = readFileSync('./input.js');
global.require = require;
const result = vm.runInThisContext(code);
vm = null

let out;

if (typeof result === 'string') {
  out = result
} else if (typeof result === 'undefined') {
  out = 'undefined'
} else {
  out = JSON.stringify(result, null, 2)
}

process.stdout.write(out);`,
    },
  },
  "input.js": {
    file: {
      contents: `const { style } = require('@opentf/cli-styles')

style('$g.bol{Hello World!}')`,
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
