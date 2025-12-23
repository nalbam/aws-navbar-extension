// ============================================
// Shared Validation Utilities
// ============================================

// Validate hex color format (#RRGGBB)
function isValidHexColor(color) {
  return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
}

// Validate region code exists in colors object
function isValidRegion(region) {
  return region && typeof region === 'string' && colors.hasOwnProperty(region);
}

// Validate and sanitize config structure
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    return {};
  }

  const validConfig = {};

  // Validate background setting
  if (config.background === 'enabled' || config.background === 'disabled') {
    validConfig.background = config.background;
  }

  // Validate flag setting
  if (config.flag === 'enabled' || config.flag === 'disabled') {
    validConfig.flag = config.flag;
  }

  // Validate customColors
  if (config.customColors && typeof config.customColors === 'object') {
    validConfig.customColors = {};
    for (const region of Object.keys(config.customColors)) {
      if (isValidRegion(region)) {
        const regionColors = config.customColors[region];
        if (regionColors && typeof regionColors === 'object') {
          const validColors = {};
          ['color1', 'color2', 'color3', 'color4'].forEach(key => {
            if (regionColors[key] === null || isValidHexColor(regionColors[key])) {
              validColors[key] = regionColors[key];
            }
          });
          if (Object.keys(validColors).length > 0) {
            validConfig.customColors[region] = validColors;
          }
        }
      }
    }
    if (Object.keys(validConfig.customColors).length === 0) {
      delete validConfig.customColors;
    }
  }

  return validConfig;
}
