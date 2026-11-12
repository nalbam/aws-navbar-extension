// Content script for the AWS Console.
// colors.js and utils.js are loaded before this script.
//
// The script owns the navbar background and the text color drawn directly on it.
// AWS renders the navbar with React and can re-render it at any time, so every
// change goes through one idempotent sync() that a MutationObserver re-runs.

const SELECTORS = {
  NAV_CONTAINER_ID: 'awsc-navigation-container',
  NAV: '#awsc-navigation-container header > nav',
  REGION_BUTTON: '[data-testid="awsc-nav-regions-menu-button"]',
  REGION_MENU: '[data-testid^="awsc-nav-more-menu-item-menu--regions"]',
  // The search field draws its own surface (the input) beside its text, not
  // behind it as an ancestor, so the whole field keeps the AWS colors.
  OWN_SURFACE: '#aws-unified-search-container',
  SNOW: '#aws-snow-container',
};

const IDS = {
  STYLESHEET: 'aws-navbar-styles',
  FLAG: 'aws-navbar-flag',
};

const CLASSES = {
  NAV: 'aws-navbar-themed',
  MENU_FLAG: 'aws-navbar-menu-flag',
};

// Marks on elements that sit directly on the themed background.
const MARKS = {
  COLOR: 'data-aws-navbar-color',
  FILL: 'data-aws-navbar-fill',
  STROKE: 'data-aws-navbar-stroke',
};

const CHRISTMAS = { MONTH: 11, START_DAY: 20, END_DAY: 26, SNOWFLAKES: 15 };

const isDebug = false;

let config = {};
let containerObserver = null;
let syncScheduled = false;

// ============================================
// Stylesheet
// ============================================

function ensureStylesheet() {
  if (document.getElementById(IDS.STYLESHEET)) return;
  const nav = `nav.${CLASSES.NAV}`;
  const style = document.createElement('style');
  style.id = IDS.STYLESHEET;
  style.textContent = `
    ${nav} { background: var(--aws-navbar-bg) !important; }
    ${nav}[data-aws-navbar-style="subtle"] {
      background: var(--aws-navbar-accent) bottom / 100% ${ACCENT_BAND_HEIGHT} no-repeat, var(--aws-navbar-bg) !important;
    }
    ${nav} [${MARKS.COLOR}] { color: var(--aws-navbar-fg) !important; }
    ${nav} [${MARKS.FILL}] { fill: var(--aws-navbar-fg) !important; }
    ${nav} [${MARKS.STROKE}] { stroke: var(--aws-navbar-fg) !important; }
    #${IDS.FLAG} { display: inline-flex; align-items: center; margin-right: 0.5em; line-height: 0; }
    #${IDS.FLAG} img { width: 20px; height: 20px; }
    .${CLASSES.MENU_FLAG} { width: 16px; height: 16px; margin-right: 6px; vertical-align: -3px; }
  `;
  document.head.appendChild(style);
}

// ============================================
// Navbar theme
// ============================================

function applyTheme(nav, region) {
  if (!region || config.background === 'disabled') {
    clearTheme(nav);
    return;
  }
  ensureStylesheet();
  const theme = getNavbarTheme(getRegionColors(config, region), getNavbarStyle(config));
  nav.classList.add(CLASSES.NAV);
  nav.dataset.awsNavbarStyle = theme.style;
  nav.style.setProperty('--aws-navbar-bg', theme.background);
  nav.style.setProperty('--aws-navbar-fg', theme.foreground);
  nav.style.setProperty('--aws-navbar-accent', theme.accent || 'none');
  markForeground(nav);
}

function clearTheme(nav) {
  nav.classList.remove(CLASSES.NAV);
  delete nav.dataset.awsNavbarStyle;
  for (const name of ['--aws-navbar-bg', '--aws-navbar-fg', '--aws-navbar-accent']) {
    nav.style.removeProperty(name);
  }
  setMarks(nav, new Map());
}

// Parse "rgb(r, g, b)" or "rgba(r, g, b, a)" into [r, g, b, a].
function parseCssColor(value) {
  const match = /^rgba?\(([^)]+)\)$/.exec(value);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
}

// Gray text and icons belong to the navbar theme. Colored ones (links, logo
// smile, badges) carry their own meaning and are left as AWS draws them.
function isGray(value) {
  const rgba = parseCssColor(value);
  if (!rgba || rgba[3] === 0) return false;
  return Math.max(rgba[0], rgba[1], rgba[2]) - Math.min(rgba[0], rgba[1], rgba[2]) <= 24;
}

function hasOwnSurface(element, style) {
  if (style.backgroundImage !== 'none') return true;
  const background = parseCssColor(style.backgroundColor);
  return (background !== null && background[3] > 0) || element.matches(SELECTORS.OWN_SURFACE);
}

function hasOwnText(element) {
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
  }
  return false;
}

// Mark gray text and SVG shapes whose nearest painted ancestor is the navbar.
// Elements under another surface (menus, search field, account color label)
// keep the AWS colors. Subtrees under another surface are skipped.
function markForeground(nav) {
  const marks = new Map();
  const walker = document.createTreeWalker(nav, NodeFilter.SHOW_ELEMENT, {
    acceptNode(element) {
      if (element.matches(SELECTORS.SNOW)) return NodeFilter.FILTER_REJECT;
      return hasOwnSurface(element, getComputedStyle(element))
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });
  for (let element = walker.nextNode(); element; element = walker.nextNode()) {
    const style = getComputedStyle(element);
    const names = [];
    if (element instanceof SVGElement) {
      if (element.tagName !== 'svg') {
        if (isGray(style.fill)) names.push(MARKS.FILL);
        if (isGray(style.stroke)) names.push(MARKS.STROKE);
      }
    } else if (hasOwnText(element) && isGray(style.color)) {
      names.push(MARKS.COLOR);
    }
    if (names.length > 0) marks.set(element, names);
  }
  setMarks(nav, marks);
}

// Apply the new marks and remove marks that no longer apply.
function setMarks(nav, marks) {
  const selector = Object.values(MARKS).map(name => `[${name}]`).join(',');
  for (const element of nav.querySelectorAll(selector)) {
    const names = marks.get(element) || [];
    for (const name of Object.values(MARKS)) {
      if (!names.includes(name)) element.removeAttribute(name);
    }
  }
  for (const [element, names] of marks) {
    for (const name of names) element.setAttribute(name, '');
  }
}

// ============================================
// Flags
// ============================================

function flagUrl(region) {
  return chrome.runtime.getURL(`flags/${colors[region].country}.png`);
}

function createFlagImage(region, className) {
  const image = document.createElement('img');
  image.src = flagUrl(region);
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  if (className) image.className = className;
  return image;
}

// Flag before the region name in the navbar region button.
// The button already names the region, so the flag is decorative.
function applyFlag(nav, region) {
  const regionButton = nav.querySelector(SELECTORS.REGION_BUTTON);
  const existing = document.getElementById(IDS.FLAG);
  if (!region || config.flag === 'disabled' || !regionButton) {
    if (existing) existing.remove();
    return;
  }
  const url = flagUrl(region);
  if (existing && existing.nextElementSibling === regionButton && existing.firstElementChild.src === url) {
    return;
  }
  if (existing) existing.remove();

  ensureStylesheet();
  const container = document.createElement('span');
  container.id = IDS.FLAG;
  container.setAttribute('aria-hidden', 'true');
  container.appendChild(createFlagImage(region));
  regionButton.parentNode.insertBefore(container, regionButton);
}

// Flags before each region name in the region menu.
// Menu item: a > span > [span name, span code]
function decorateRegionMenu(nav) {
  const showFlags = config.flag !== 'disabled';
  for (const menu of nav.querySelectorAll(SELECTORS.REGION_MENU)) {
    for (const link of menu.querySelectorAll('a')) {
      const label = link.firstElementChild;
      const name = label && label.firstElementChild;
      const code = label && label.lastElementChild;
      if (!name || name === code) continue;
      const region = code.textContent.trim();
      const flag = name.querySelector(`.${CLASSES.MENU_FLAG}`);
      if (!showFlags || !isValidRegion(region)) {
        if (flag) flag.remove();
        continue;
      }
      if (!flag) {
        ensureStylesheet();
        name.prepend(createFlagImage(region, CLASSES.MENU_FLAG));
      }
    }
  }
}

// ============================================
// Christmas snow (Dec 20-26)
// ============================================

function isChristmasSeason() {
  const now = new Date();
  return now.getMonth() === CHRISTMAS.MONTH &&
    now.getDate() >= CHRISTMAS.START_DAY && now.getDate() <= CHRISTMAS.END_DAY;
}

function createSnowfall(nav) {
  if (!isChristmasSeason() || document.querySelector(SELECTORS.SNOW)) return;

  const style = document.createElement('style');
  style.id = 'aws-snow-styles';
  style.textContent = `
    @keyframes aws-snowfall {
      0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      50% { transform: translateY(25px) translateX(10px) rotate(180deg); opacity: 0.9; }
      80% { opacity: 0.7; }
      100% { transform: translateY(80px) translateX(-5px) rotate(360deg); opacity: 0; }
    }
    @keyframes aws-snowfall-alt {
      0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      50% { transform: translateY(25px) translateX(-10px) rotate(-180deg); opacity: 0.9; }
      80% { opacity: 0.7; }
      100% { transform: translateY(80px) translateX(5px) rotate(-360deg); opacity: 0; }
    }
    #aws-snow-container {
      position: absolute; top: -30px; left: 0; width: 100%; height: calc(100% + 30px);
      overflow: hidden; pointer-events: none; z-index: 1000;
    }
    .aws-snowflake {
      position: absolute; top: 0; user-select: none; will-change: transform, opacity;
      color: var(--aws-navbar-fg, #ffffff);
    }
    .aws-snowflake-left { animation: aws-snowfall ease-in-out infinite; }
    .aws-snowflake-right { animation: aws-snowfall-alt ease-in-out infinite; }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'aws-snow-container';
  container.setAttribute('aria-hidden', 'true');
  const symbols = ['❄', '❅', '❆', '✻', '✼', '❉'];
  for (let i = 0; i < CHRISTMAS.SNOWFLAKES; i++) {
    const flake = document.createElement('span');
    flake.className = `aws-snowflake ${Math.random() > 0.5 ? 'aws-snowflake-left' : 'aws-snowflake-right'}`;
    flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    flake.style.cssText = `left:${Math.random() * 100}%;font-size:${8 + Math.random() * 10}px;` +
      `animation-duration:${4 + Math.random() * 4}s;animation-delay:${Math.random() * 5}s;`;
    container.appendChild(flake);
  }
  nav.style.position = 'relative';
  nav.appendChild(container);
}

// ============================================
// Sync
// ============================================

function sync() {
  syncScheduled = false;
  const nav = document.querySelector(SELECTORS.NAV);
  if (!nav) return;
  const region = detectRegion(location.hostname, document.title);
  if (isDebug) console.log(`[aws-navbar] sync region=${region}`);

  // Our own DOM writes must not trigger another sync.
  if (containerObserver) containerObserver.disconnect();
  applyTheme(nav, region);
  applyFlag(nav, region);
  decorateRegionMenu(nav);
  if (region && config.background !== 'disabled') createSnowfall(nav);
  observeContainer();
}

function scheduleSync() {
  if (syncScheduled) return;
  syncScheduled = true;
  requestAnimationFrame(sync);
}

function observeContainer() {
  const container = document.getElementById(SELECTORS.NAV_CONTAINER_ID);
  if (!container) return;
  if (!containerObserver) containerObserver = new MutationObserver(scheduleSync);
  containerObserver.observe(container, { childList: true, subtree: true, characterData: true });
}

// The console can render the navbar after this script runs.
function whenContainerExists(callback) {
  if (document.getElementById(SELECTORS.NAV_CONTAINER_ID)) {
    callback();
    return;
  }
  const observer = new MutationObserver(() => {
    if (document.getElementById(SELECTORS.NAV_CONTAINER_ID)) {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

// Global services set "| Global" in the page title after the first render.
// The head also receives style elements, so only a title change schedules a sync.
function observeTitle() {
  let lastTitle = document.title;
  new MutationObserver(() => {
    if (document.title === lastTitle) return;
    lastTitle = document.title;
    scheduleSync();
  }).observe(document.head, { childList: true, subtree: true, characterData: true });
}

// ============================================
// Start
// ============================================

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.config) {
    config = validateConfig(changes.config.newValue);
    scheduleSync();
  }
});

chrome.storage.local.get('config', (result) => {
  config = validateConfig(result.config);
  whenContainerExists(() => {
    observeTitle();
    // The more menu collapses at small widths without a DOM change.
    window.addEventListener('resize', debounce(scheduleSync, 150));
    sync();
  });
});
