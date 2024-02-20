"use strict";
const vm = require("node:vm");

const code = `const path = require('node:path'); path.join('a', 'b')`;
global.require = require
const result = vm.runInThisContext(code);

console.log(result);
