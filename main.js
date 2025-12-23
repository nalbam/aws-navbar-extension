// colors.js is loaded before this script

const langs = {
  'ko': {
    '글로벌': 'Global',
  },
  'jp': {
    'グローバル': 'Global',
  },
}

const isDebug = true;

// Get current region from URL
function getCurrentRegion() {
  const cityElement = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span');
  if (!cityElement) return null;

  let city = cityElement.innerText;
  const lang = document.documentElement.lang;
  if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(city)) {
    city = langs[lang][city];
  }

  if (city === 'Global') return 'global';

  const re = /^https:\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)*)?\.?console\.aws\.amazon\.com\/.*/;
  const m = re.exec(window.location.href);
  if (m !== undefined) {
    const hostPart = m[1];
    if (hostPart) {
      const lastDotIndex = hostPart.lastIndexOf('.');
      return lastDotIndex !== -1 ? hostPart.substring(lastDotIndex + 1) : hostPart;
    }
  }
  return null;
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

  const navElement = document.querySelector("#awsc-navigation-container>div>header>nav");
  if (navElement) {
    navElement.style.background = background;
    if (isDebug) console.log(`Applied background: ${background}`);
  }
}

// Listen for storage changes (live update)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.config) {
    const newConfig = changes.config.newValue || {};
    if (isDebug) console.log('Config changed, applying new colors...');
    applyBackgroundColor(newConfig);
  }
});

// load
chrome.storage.local.get('config', (c) => {
  try {
    const config = c.config !== undefined ? c.config : {};
    if (isDebug) console.log(`config: ${JSON.stringify(config, null, 2)}`);

    const initializeAWS = (retryCount = 0) => {
      const cityElement = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span');
      if (!cityElement) {
        if (retryCount < 3) {
          console.log(`Region selector not found, retrying... (${retryCount + 1}/3)`);
          setTimeout(() => initializeAWS(retryCount + 1), 1000);
          return;
        }
        console.error('Region selector not found after 3 retries');
        return;
      }

      let city = cityElement.innerText;

      // lang
      const lang = document.documentElement.lang;
      if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(city)) {
        city = langs[lang][city];
        if (isDebug) console.log(`city: ${city}`);
      }

      // Extract region from URL
      let region = undefined;
      const re = /^https:\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)*)?\.?console\.aws\.amazon\.com\/.*/;
      const m = re.exec(window.location.href);
      if (m !== undefined) {
        if (city === 'Global') {
          region = 'global';
        } else {
          const hostPart = m[1];
          if (hostPart) {
            const lastDotIndex = hostPart.lastIndexOf('.');
            if (lastDotIndex !== -1) {
              region = hostPart.substring(lastDotIndex + 1);
            } else {
              region = hostPart;
            }
          }
        }
      }

      if (isDebug) console.log(`region: ${region}`);

      if (colors.hasOwnProperty(region)) {
        // Get background color (custom or default)
        let background = getDefaultGradient(region);
        if (config['customColors'] && config['customColors'][region]) {
          background = buildGradient(config['customColors'][region]);
        }

        // region header background
        if (config['background'] !== 'disabled') {
          const navElement = document.querySelector("#awsc-navigation-container>div>header>nav");
          if (navElement) {
            navElement.style.background = background;
          }
        }

        // region flag
        if (config['flag'] !== 'disabled') {
          const regionButton = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]');
          if (regionButton) {
            const flag = chrome.runtime.getURL(`flags/${colors[region]['country']}.png`);
            regionButton.insertAdjacentHTML("beforeBegin", `<span style="line-height:0;margin-right:0.5em;"><img src="${flag}" style="width:20px;height:20px;"></span>`);
          }
        }
      }
    };

    // Start initialization
    initializeAWS();

  } catch (error) {
    console.error('Error:', error);
  }
});
