export const files = {
  "index.js": {
    file: {
      contents: `'use strict';
      const vm = require('node:vm');
      const {readFileSync} = require('node:fs');
      const code = readFileSync('./input.js');
      global.require = require
      const result = vm.runInThisContext(code); 
      console.log(result)`,
    },
  },
  "input.js": {
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
  "dependencies": {
    "lodash": "latest",
    "@opentf/cli-styles": "latest",
    "@opentf/cli-pbar": "latest"
  },
  "scripts": {
    "start": "node index.js"
  }
}`,
    },
  },
};
