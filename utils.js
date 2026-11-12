// ============================================
// Shared Utilities (content script and popup)
// ============================================
// colors.js is loaded before this script.

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const CUSTOM_COLOR_KEYS = ['color1', 'color2', 'color3', 'color4'];

// Validate hex color format (#RRGGBB)
function isValidHexColor(color) {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color);
}

// Validate region code exists in colors object
function isValidRegion(region) {
  return typeof region === 'string' && Object.prototype.hasOwnProperty.call(colors, region);
}

// Debounce function to limit execution rate
function debounce(func, wait) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

// ============================================
// Config
// ============================================

// Validate and sanitize config structure.
// Unknown keys and invalid values are dropped; callers apply the defaults.
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    return {};
  }

  const validConfig = {};

  for (const key of ['background', 'flag']) {
    if (config[key] === 'enabled' || config[key] === 'disabled') {
      validConfig[key] = config[key];
    }
  }

  if (Object.prototype.hasOwnProperty.call(NAVBAR_STYLES, config.style)) {
    validConfig.style = config.style;
  }

  if (config.customColors && typeof config.customColors === 'object') {
    const customColors = {};
    for (const region of Object.keys(config.customColors)) {
      const regionColors = config.customColors[region];
      if (!isValidRegion(region) || !regionColors || typeof regionColors !== 'object') continue;
      const validColors = {};
      for (const key of CUSTOM_COLOR_KEYS) {
        if (regionColors[key] === null || isValidHexColor(regionColors[key])) {
          validColors[key] = regionColors[key];
        }
      }
      if (Object.keys(validColors).length > 0) {
        customColors[region] = validColors;
      }
    }
    if (Object.keys(customColors).length > 0) {
      validConfig.customColors = customColors;
    }
  }

  return validConfig;
}

// Navbar style of a config (default when not set)
function getNavbarStyle(config) {
  return config.style || DEFAULT_NAVBAR_STYLE;
}

// Flag colors of a region: custom colors when at least 2 are set, else the defaults.
function getRegionColors(config, region) {
  const custom = config.customColors && config.customColors[region];
  if (custom) {
    const customList = CUSTOM_COLOR_KEYS.map(key => custom[key]).filter(isValidHexColor);
    if (customList.length >= 2) {
      return customList;
    }
  }
  return [...colors[region].colors];
}

// ============================================
// Region detection
// ============================================

// Return the region code that the console page shows, or null.
// - Global services (IAM, CloudFront, ...) run on us-east-1 hosts, but the
//   console ends their page title with "| Global" in every console language.
// - Regional pages carry the region in the host name:
//   <region>.console.aws.amazon.com or <account-alias>.<region>.console.aws.amazon.com
function detectRegion(hostname, title) {
  if (/\|\s*Global\s*$/.test(title)) {
    return 'global';
  }
  const suffix = '.console.aws.amazon.com';
  if (!hostname.endsWith(suffix)) {
    return null;
  }
  const labels = hostname.slice(0, -suffix.length).split('.');
  const region = labels[labels.length - 1];
  return region !== 'global' && isValidRegion(region) ? region : null;
}
