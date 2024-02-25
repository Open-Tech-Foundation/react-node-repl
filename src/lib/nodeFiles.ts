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

const code = readFileSync('./main.js');
global.require = require;
global.log = console.log;
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
      contents: `const { style } = require('@opentf/cli-styles')

style(\`$g.bol{Hello World 👋}
$gr{-> Node.js \${process.version}}\`)`,
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
