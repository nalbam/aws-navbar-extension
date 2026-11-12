const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./load');

const get = loadScripts('colors.js');
const colors = get('colors');
const getNavbarTheme = get('getNavbarTheme');
const contrastRatio = get('contrastRatio');
const hexToRgb = get('hexToRgb');
const MIN = get('MIN_TEXT_CONTRAST');
const STYLES = Object.keys(get('NAVBAR_STYLES'));

const stopsOf = gradient => gradient.match(/#[0-9a-f]{6}/gi);

// Browsers interpolate legacy-syntax gradients in gamma-encoded sRGB.
function sampleGradient(stops, samplesPerSegment = 32) {
  const samples = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = hexToRgb(stops[i]);
    const b = hexToRgb(stops[i + 1]);
    for (let s = 0; s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      samples.push(a.map((v, c) => v + (b[c] - v) * t));
    }
  }
  return samples;
}

function minContrast(theme) {
  const foreground = hexToRgb(theme.foreground);
  return Math.min(...sampleGradient(stopsOf(theme.background)).map(rgb => contrastRatio(rgb, foreground)));
}

test('contrast ratio matches WCAG reference values', () => {
  assert.equal(contrastRatio([255, 255, 255], [0, 0, 0]), 21);
  assert.equal(contrastRatio([0, 0, 0], [0, 0, 0]), 1);
  assert.ok(Math.abs(contrastRatio([0x76, 0x76, 0x76], [255, 255, 255]) - 4.54) < 0.01);
});

for (const style of STYLES) {
  test(`${style}: navbar text is readable across every default region gradient`, () => {
    for (const [region, data] of Object.entries(colors)) {
      const ratio = minContrast(getNavbarTheme(data.colors, style));
      assert.ok(ratio >= MIN, `${region} min contrast ${ratio.toFixed(2)} < ${MIN}`);
    }
  });

  test(`${style}: extreme custom colors are made readable`, () => {
    const extremes = ['#ffffff', '#ffff00', '#00ffff', '#000000', '#808080', '#ff0000'];
    for (const a of extremes) {
      for (const b of extremes) {
        const ratio = minContrast(getNavbarTheme([a, b], style));
        assert.ok(ratio >= MIN, `${a} -> ${b} min contrast ${ratio.toFixed(2)}`);
      }
    }
  });
}

test('vivid keeps flag colors that are already readable', () => {
  const theme = getNavbarTheme(['#dd0022', '#0000aa'], 'vivid');
  assert.deepEqual(stopsOf(theme.background), ['#dd0022', '#0000aa']);
  assert.equal(theme.adjusted, false);
  assert.equal(theme.accent, null);
});

test('vivid shades light flag colors and reports the adjustment', () => {
  const theme = getNavbarTheme(['#009944', '#ffee00', '#002288'], 'vivid');
  const [, yellow] = stopsOf(theme.background);
  assert.notEqual(yellow, '#ffee00');
  assert.equal(theme.adjusted, true);
});

test('subtle shows the pure flag colors in the accent band', () => {
  const theme = getNavbarTheme(['#dd0022', '#0000aa'], 'subtle');
  assert.equal(theme.accent, 'linear-gradient(to right, #dd0022, #0000aa)');
  assert.equal(theme.foreground, '#16191f');
});

test('unknown style is rejected', () => {
  assert.throws(() => getNavbarTheme(['#000000', '#ffffff'], 'neon'), /Unknown navbar style/);
});

test('every region has a flag image', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  for (const [region, data] of Object.entries(colors)) {
    const file = path.join(__dirname, '..', 'flags', `${data.country}.png`);
    assert.ok(fs.existsSync(file), `${region}: missing flags/${data.country}.png`);
  }
});
