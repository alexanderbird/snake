#!/usr/bin/env node
const { runAll } = require('./test/diyUnit');
const fs = require('fs');

(async function main() {
  const tests = fs.readdirSync('test').filter(x => x.endsWith('.spec.js'));

  for (let test of tests) {
    await require('./test/' + test);
  }

  await runAll();
})();
