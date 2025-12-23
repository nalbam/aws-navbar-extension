// colors.js is loaded before this script

// ============================================
// Constants - DOM Selectors
// ============================================
const SELECTORS = {
  REGION_BUTTON: '[data-testid="awsc-nav-regions-menu-button"]',
  REGION_BUTTON_SPAN: '[data-testid="awsc-nav-regions-menu-button"]>span',
  NAV_ELEMENT: '#awsc-navigation-container>div>header>nav',
};

// ============================================
// Constants - Configuration
// ============================================
const CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
  CHRISTMAS_START_DAY: 20,
  CHRISTMAS_END_DAY: 26,
  SNOWFLAKE_COUNT: 15,
};

// Check if it's Christmas season
function isChristmasSeason() {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();
  return month === 11 && day >= CONFIG.CHRISTMAS_START_DAY && day <= CONFIG.CHRISTMAS_END_DAY;
}

// Create snowfall effect on navbar
function createSnowfall(navElement) {
  if (!isChristmasSeason()) return;

  // Prevent duplicate snow containers
  if (document.getElementById('aws-snow-container')) return;

  // Add snow container
  const snowContainer = document.createElement('div');
  snowContainer.id = 'aws-snow-container';
  snowContainer.style.cssText = `
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    height: calc(100% + 30px);
    overflow: hidden;
    pointer-events: none;
    z-index: 1000;
  `;

  // Add CSS animation - more natural snowfall with gentle sway
  const style = document.createElement('style');
  style.id = 'aws-snow-styles';
  style.textContent = `
    @keyframes aws-snowfall {
      0% {
        transform: translateY(-30px) translateX(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      50% {
        transform: translateY(25px) translateX(10px) rotate(180deg);
        opacity: 0.9;
      }
      80% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(80px) translateX(-5px) rotate(360deg);
        opacity: 0;
      }
    }
    @keyframes aws-snowfall-alt {
      0% {
        transform: translateY(-30px) translateX(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      50% {
        transform: translateY(25px) translateX(-10px) rotate(-180deg);
        opacity: 0.9;
      }
      80% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(80px) translateX(5px) rotate(-360deg);
        opacity: 0;
      }
    }
    .aws-snowflake {
      position: absolute;
      top: 0;
      color: white;
      text-shadow: 0 0 4px rgba(255,255,255,0.9);
      user-select: none;
      will-change: transform, opacity;
    }
    .aws-snowflake-left {
      animation: aws-snowfall ease-in-out infinite;
    }
    .aws-snowflake-right {
      animation: aws-snowfall-alt ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  // Create snowflakes with varied properties using DocumentFragment
  const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉'];
  const snowFragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.SNOWFLAKE_COUNT; i++) {
    const flake = document.createElement('span');
    const isLeftSway = Math.random() > 0.5;
    const left = Math.random() * 100;
    const fontSize = 8 + Math.random() * 10;
    const duration = 4 + Math.random() * 4;
    const delay = Math.random() * 5;

    flake.className = `aws-snowflake ${isLeftSway ? 'aws-snowflake-left' : 'aws-snowflake-right'}`;
    flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    // Batch style assignments using cssText (single style recalculation)
    flake.style.cssText = `left:${left}%;font-size:${fontSize}px;animation-duration:${duration}s;animation-delay:${delay}s;`;
    snowFragment.appendChild(flake);
  }
  snowContainer.appendChild(snowFragment);

  // Make nav position relative for absolute positioning of snow
  navElement.style.position = 'relative';
  navElement.appendChild(snowContainer);

  if (isDebug) console.log('🎄 Christmas snow effect enabled!');
}

const langs = {
  'ko': {
    '글로벌': 'Global',
  },
  'jp': {
    'グローバル': 'Global',
  },
}

const isDebug = false;

// DOM element cache to avoid repeated querySelector calls
const domCache = {
  navElement: null,
  regionButton: null,
  regionButtonSpan: null,
};

// Get cached DOM element or query and cache it
function getCachedElement(key, selector) {
  if (!domCache[key]) {
    domCache[key] = document.querySelector(selector);
  }
  return domCache[key];
}

// Note: Validation functions (isValidHexColor, isValidRegion, validateConfig)
// are loaded from utils.js

// ============================================
// Region Detection Utilities
// ============================================

// Extract region code from AWS Console URL
function extractRegionFromUrl() {
  const re = /^https:\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)*)?\.?console\.aws\.amazon\.com\/.*/;
  const match = re.exec(window.location.href);
  if (match && match[1]) {
    const hostPart = match[1];
    const lastDotIndex = hostPart.lastIndexOf('.');
    return lastDotIndex !== -1 ? hostPart.substring(lastDotIndex + 1) : hostPart;
  }
  return null;
}

// Translate city name based on language
function translateCity(city) {
  const lang = document.documentElement.lang;
  if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(city)) {
    return langs[lang][city];
  }
  return city;
}

// Get current region from URL and city element
function getCurrentRegion() {
  const cityElement = getCachedElement('regionButtonSpan', SELECTORS.REGION_BUTTON_SPAN);
  if (!cityElement) return null;

  const city = translateCity(cityElement.innerText);
  if (city === 'Global') return 'global';

  return extractRegionFromUrl();
}

// Get background gradient for region
function getBackgroundForRegion(config, region) {
  if (config['customColors'] && config['customColors'][region]) {
    return buildGradient(config['customColors'][region]);
  }
  return getDefaultGradient(region);
}

// Apply navbar background color
// @param {Object} config - Configuration object
// @param {string} region - AWS region code (optional, will detect if not provided)
// @param {boolean} withSnowfall - Whether to apply snowfall effect (default: false)
function applyNavbarBackground(config, region = null, withSnowfall = false) {
  // Get region if not provided (for live updates)
  const targetRegion = region || getCurrentRegion();
  if (!targetRegion || !colors.hasOwnProperty(targetRegion)) return;

  if (config['background'] === 'disabled') return;

  const navElement = getCachedElement('navElement', SELECTORS.NAV_ELEMENT);
  if (navElement) {
    navElement.style.background = getBackgroundForRegion(config, targetRegion);
    if (withSnowfall) {
      createSnowfall(navElement);
    }
    if (isDebug) console.log(`Applied background for ${targetRegion}`);
  }
}

// Listen for storage changes (live update)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.config) {
    try {
      const newConfig = validateConfig(changes.config.newValue);
      if (isDebug) console.log('Config changed, applying new colors...');
      // Live update without snowfall (already created on init)
      applyNavbarBackground(newConfig);
    } catch (error) {
      console.error('Error applying config changes:', error);
    }
  }
});

// Insert country flag before region button
function insertRegionFlag(config, region) {
  if (config['flag'] === 'disabled') return;

  const regionButton = getCachedElement('regionButton', SELECTORS.REGION_BUTTON);
  if (regionButton && regionButton.parentNode) {
    const flagUrl = chrome.runtime.getURL(`flags/${colors[region]['country']}.png`);
    const flagContainer = document.createElement('span');
    flagContainer.id = 'aws-navbar-flag';
    flagContainer.style.cssText = 'line-height:0;margin-right:0.5em;';

    const flagImg = document.createElement('img');
    flagImg.src = flagUrl;
    flagImg.style.cssText = 'width:20px;height:20px;';
    flagImg.alt = colors[region]['name'];

    // Handle image load error - show emoji fallback
    flagImg.onerror = () => {
      flagContainer.textContent = colors[region]['emoji'] || '🌐';
      flagContainer.style.cssText = 'margin-right:0.5em;font-size:16px;';
      if (isDebug) console.log(`Flag image failed to load for ${region}, using emoji fallback`);
    };

    flagContainer.appendChild(flagImg);
    regionButton.parentNode.insertBefore(flagContainer, regionButton);
  }
}

// Initialize AWS Console customization with retry mechanism
function initializeAWS(config, retryCount = 0) {
  const cityElement = document.querySelector(SELECTORS.REGION_BUTTON_SPAN);
  if (!cityElement) {
    if (retryCount < CONFIG.MAX_RETRY_COUNT) {
      console.log(`Region selector not found, retrying... (${retryCount + 1}/${CONFIG.MAX_RETRY_COUNT})`);
      setTimeout(() => initializeAWS(config, retryCount + 1), CONFIG.RETRY_DELAY_MS);
      return;
    }
    console.error(`Region selector not found after ${CONFIG.MAX_RETRY_COUNT} retries`);
    return;
  }

  const region = getCurrentRegion();
  if (isDebug) console.log(`region: ${region}`);

  if (region && colors.hasOwnProperty(region)) {
    applyNavbarBackground(config, region, true); // withSnowfall = true on init
    insertRegionFlag(config, region);
  }
}

// Load config and initialize
chrome.storage.local.get('config', (result) => {
  try {
    const config = validateConfig(result.config);
    if (isDebug) console.log(`config: ${JSON.stringify(config, null, 2)}`);
    initializeAWS(config);
  } catch (error) {
    console.error('Error initializing AWS navbar:', error);
    // Attempt initialization with empty config as fallback
    initializeAWS({});
  }
});
