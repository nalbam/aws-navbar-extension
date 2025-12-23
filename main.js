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

  // Add snow container
  const snowContainer = document.createElement('div');
  snowContainer.id = 'aws-snow-container';
  snowContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1000;
  `;

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes aws-snowfall {
      0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(50px) rotate(360deg);
        opacity: 0.3;
      }
    }
    .aws-snowflake {
      position: absolute;
      color: white;
      text-shadow: 0 0 3px rgba(255,255,255,0.8);
      animation: aws-snowfall linear infinite;
      user-select: none;
    }
  `;
  document.head.appendChild(style);

  // Create snowflakes
  const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉'];

  for (let i = 0; i < CONFIG.SNOWFLAKE_COUNT; i++) {
    const flake = document.createElement('span');
    flake.className = 'aws-snowflake';
    flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.fontSize = `${8 + Math.random() * 8}px`;
    flake.style.animationDuration = `${2 + Math.random() * 3}s`;
    flake.style.animationDelay = `${Math.random() * 3}s`;
    flake.style.opacity = `${0.5 + Math.random() * 0.5}`;
    snowContainer.appendChild(flake);
  }

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
  const cityElement = document.querySelector(SELECTORS.REGION_BUTTON_SPAN);
  if (!cityElement) return null;

  const city = translateCity(cityElement.innerText);
  if (city === 'Global') return 'global';

  return extractRegionFromUrl();
}

// Apply background color
function applyBackgroundColor(config) {
  const region = getCurrentRegion();
  if (!region || !colors.hasOwnProperty(region)) return;

  if (config['background'] === 'disabled') return;

  let background = getDefaultGradient(region);
  if (config['customColors'] && config['customColors'][region]) {
    background = buildGradient(config['customColors'][region]);
  }

  const navElement = document.querySelector(SELECTORS.NAV_ELEMENT);
  if (navElement) {
    navElement.style.background = background;
    if (isDebug) console.log(`Applied background: ${background}`);
  }
}

// Listen for storage changes (live update)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.config) {
    try {
      const newConfig = validateConfig(changes.config.newValue);
      if (isDebug) console.log('Config changed, applying new colors...');
      applyBackgroundColor(newConfig);
    } catch (error) {
      console.error('Error applying config changes:', error);
    }
  }
});

// Get background gradient for region
function getBackgroundForRegion(config, region) {
  if (config['customColors'] && config['customColors'][region]) {
    return buildGradient(config['customColors'][region]);
  }
  return getDefaultGradient(region);
}

// Apply navbar background color with snowfall effect
function applyNavbarBackground(config, region) {
  if (config['background'] === 'disabled') return;

  const navElement = document.querySelector(SELECTORS.NAV_ELEMENT);
  if (navElement) {
    navElement.style.background = getBackgroundForRegion(config, region);
    createSnowfall(navElement);
  }
}

// Insert country flag before region button
function insertRegionFlag(config, region) {
  if (config['flag'] === 'disabled') return;

  const regionButton = document.querySelector(SELECTORS.REGION_BUTTON);
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
    applyNavbarBackground(config, region);
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
