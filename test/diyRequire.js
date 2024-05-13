const fs = require('fs');
const path = require('path');

async function diyRequire(name) {
  const requirePath = path.resolve(path.join(__dirname, '..', 'public', name + '.js'));
  const file = fs.readFileSync(requirePath, 'utf-8');
  const module = {};
  const dependsOn = async name => diyRequire(name);
  eval(file);
  if (!module[name]) {
    const helpMessage = `Import error: ${requirePath} did not assign anything to 'module.${name}'`;
    throw new Error(helpMessage);
  }
  return await module[name];
}

module.exports = { diyRequire };
