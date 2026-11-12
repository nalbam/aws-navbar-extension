// Repository checks: the files that the extension and the homepage load exist,
// are packaged and agree with each other. The release workflow runs these
// tests before it packages the extension.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { loadScripts } = require('./load');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = file => fs.existsSync(path.join(ROOT, file));
const listDir = (dir, ext) => fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith(ext));

const MANIFESTS = ['manifest.json', 'manifest-v2.json'];

// Files and directories that package.sh copies into each package.
const PACKAGE_ITEMS = read('package.sh').match(/^ITEMS="([^"]+)"$/m)[1].split(' ');
const isPackaged = file => PACKAGE_ITEMS.some(item => file === item || file.startsWith(`${item}/`));

// Files that a manifest names.
function manifestFiles(manifest) {
  const action = manifest.action || manifest.browser_action;
  return [
    ...manifest.content_scripts.flatMap(script => script.js),
    action.default_popup,
    ...Object.values(action.default_icon),
    ...Object.values(manifest.icons),
  ];
}

// Local files that popup.html loads (scripts, stylesheets, images).
function popupFiles() {
  return [...read('popup.html').matchAll(/\b(?:src|href)="([^"]+)"/g)].map(match => match[1]);
}

test('JavaScript files have valid syntax', () => {
  const files = [...listDir('.', '.js'), ...listDir('docs', '.js').map(f => `docs/${f}`)];
  for (const file of files) {
    assert.doesNotThrow(() => new vm.Script(read(file), { filename: file }), file);
  }
});

test('docs/colors.js is a copy of colors.js', () => {
  assert.equal(read('docs/colors.js'), read('colors.js'));
});

test('every file that the extension loads exists and is packaged', () => {
  for (const name of MANIFESTS) {
    const manifest = JSON.parse(read(name));
    for (const file of [...manifestFiles(manifest), ...popupFiles()]) {
      assert.ok(exists(file), `${name}: ${file} does not exist`);
      assert.ok(isPackaged(file), `${name}: ${file} is not in the ITEMS of package.sh`);
    }
  }
});

test('both manifests run the same content scripts on the same pages', () => {
  const [mv3, mv2] = MANIFESTS.map(name => JSON.parse(read(name)));
  assert.deepEqual(mv2.content_scripts, mv3.content_scripts);
});

test('every flag image belongs to a region and the homepage has a copy', () => {
  const colors = loadScripts('colors.js')('colors');
  const countries = new Set(Object.values(colors).map(region => region.country));
  const flags = listDir('flags', '.png').map(f => f.slice(0, -'.png'.length));
  assert.deepEqual(flags.filter(flag => !countries.has(flag)), [], 'flag images without a region');
  for (const country of countries) {
    assert.equal(fs.readFileSync(path.join(ROOT, 'docs/images/flags', `${country}.png`)).compare(
      fs.readFileSync(path.join(ROOT, 'flags', `${country}.png`))), 0, `docs/images/flags/${country}.png`);
  }
});
