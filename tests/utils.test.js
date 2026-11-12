const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./load');

const get = loadScripts('colors.js', 'utils.js');
const detectRegion = get('detectRegion');
const validateConfig = get('validateConfig');
const getRegionColors = get('getRegionColors');
const getNavbarStyle = get('getNavbarStyle');

test('detectRegion reads the region from the host name', () => {
  assert.equal(detectRegion('ap-northeast-2.console.aws.amazon.com', 'EC2 | ap-northeast-2'), 'ap-northeast-2');
  assert.equal(detectRegion('123456789012-abcd1234.eu-west-1.console.aws.amazon.com', 'S3 | eu-west-1'), 'eu-west-1');
});

test('detectRegion returns global when the page title ends with "| Global"', () => {
  // Titles observed in the Korean console: the region part is not translated.
  assert.equal(detectRegion('123456789012-abcd1234.us-east-1.console.aws.amazon.com', '대시보드 | IAM | Global'), 'global');
  assert.equal(detectRegion('us-east-1.console.aws.amazon.com', 'Route 53 | Global'), 'global');
});

test('detectRegion returns null for hosts without a known region', () => {
  assert.equal(detectRegion('console.aws.amazon.com', 'AWS Management Console'), null);
  assert.equal(detectRegion('xx-nowhere-9.console.aws.amazon.com', ''), null);
  assert.equal(detectRegion('example.com', ''), null);
  assert.equal(detectRegion('global.console.aws.amazon.com', ''), null);
});

test('validateConfig keeps valid values and drops the rest', () => {
  const config = validateConfig({
    background: 'enabled',
    flag: 'nope',
    style: 'subtle',
    extra: 1,
    customColors: {
      'us-east-1': { color1: '#112233', color2: '#445566', color3: null, color4: 'red' },
      'mars-1': { color1: '#112233', color2: '#445566' },
    },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(config)), {
    background: 'enabled',
    style: 'subtle',
    customColors: { 'us-east-1': { color1: '#112233', color2: '#445566', color3: null } },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(validateConfig({ style: 'neon' }))), {});
  assert.deepEqual(JSON.parse(JSON.stringify(validateConfig(null))), {});
});

test('getNavbarStyle defaults to vivid', () => {
  assert.equal(getNavbarStyle({}), 'vivid');
  assert.equal(getNavbarStyle({ style: 'subtle' }), 'subtle');
});

test('getRegionColors prefers 2 or more custom colors', () => {
  const custom = { customColors: { 'us-east-1': { color1: '#112233', color2: '#445566', color3: null } } };
  assert.deepEqual([...getRegionColors(custom, 'us-east-1')], ['#112233', '#445566']);
  const single = { customColors: { 'us-east-1': { color1: '#112233' } } };
  assert.deepEqual([...getRegionColors(single, 'us-east-1')], ['#0000aa', '#ee2244']);
  assert.deepEqual([...getRegionColors({}, 'global')], ['#0077dd', '#119955']);
});
