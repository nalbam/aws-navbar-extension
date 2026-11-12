// Load the browser scripts (no module system) into one VM context, as the
// manifest does for the content script: colors.js, then utils.js.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadScripts(...files) {
  const context = vm.createContext({});
  for (const file of files) {
    const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }
  // Top-level const/let are not context properties; read them by evaluation.
  return name => vm.runInContext(name, context);
}

module.exports = { loadScripts };
