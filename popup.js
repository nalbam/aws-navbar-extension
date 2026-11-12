// colors.js and utils.js are loaded before this script

let currentRegion = null;
let currentColors = [];
let currentStyle = DEFAULT_NAVBAR_STYLE;
let cachedConfig = null;

// Debounced preview update for performance (50ms delay)
const debouncedUpdatePreview = debounce(updatePreview, 50);

// Listen for storage changes from other contexts (e.g., content script)
// This invalidates the cache when config changes externally
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.config) {
    cachedConfig = changes.config.newValue ?? {};
  }
});

const SUCCESS_MESSAGE_MS = 2000;
let statusTimer = null;

// Show the result of the last action below the settings. The element has
// role="status", so screen readers announce it. A success message goes away
// after a short time; an error message stays until the next result.
function showStatus(message, kind) {
  const status = document.getElementById('status-message');
  clearTimeout(statusTimer);
  status.textContent = message;
  status.dataset.kind = kind;
  if (kind === 'success') {
    statusTimer = setTimeout(() => {
      status.textContent = '';
    }, SUCCESS_MESSAGE_MS);
  }
}

function showError(message) {
  console.error(message);
  showStatus(message, 'error');
}

document.addEventListener('DOMContentLoaded', () => {
  // Set version from manifest
  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => {
      if (!response.ok) throw new Error('Failed to load manifest');
      return response.json();
    })
    .then(manifest => {
      document.querySelector('.version').textContent = `v${manifest.version}`;
    })
    .catch(error => {
      console.error('Error loading manifest:', error);
      document.querySelector('.version').textContent = '';
    });

  // Populate region dropdown using DocumentFragment (single DOM update)
  const regionSelect = document.getElementById('region-select');
  const optionsList = regionSelect.querySelector('.select-options');
  const regionFragment = document.createDocumentFragment();

  Object.keys(colors).sort().forEach(region => {
    const li = document.createElement('li');
    li.id = `region-option-${region}`;
    li.className = 'select-option';
    li.setAttribute('role', 'option');
    li.setAttribute('data-value', region);

    const flagImg = document.createElement('img');
    flagImg.src = `flags/${colors[region].country}.png`;
    flagImg.alt = '';
    flagImg.className = 'region-flag';
    flagImg.setAttribute('aria-hidden', 'true');

    const textSpan = document.createElement('span');
    textSpan.textContent = `${region} - ${colors[region].name}`;

    li.appendChild(flagImg);
    li.appendChild(textSpan);
    regionFragment.appendChild(li);
  });

  optionsList.appendChild(regionFragment);

  // Load saved settings
  chrome.storage.local.get('config', (result) => {
    try {
      if (chrome.runtime.lastError) {
        console.error('Error loading config:', chrome.runtime.lastError);
      }
      // Initialize cache
      cachedConfig = result.config ?? {};

      // Set checkbox states
      document.getElementById('background').checked = cachedConfig['background'] !== 'disabled';
      document.getElementById('flag').checked = cachedConfig['flag'] !== 'disabled';

      // Set navbar style
      currentStyle = getNavbarStyle(validateConfig(cachedConfig));
      document.querySelector(`input[name="style"][value="${currentStyle}"]`).checked = true;
    } catch (error) {
      console.error('Error initializing settings:', error);
    }

    // Load theme preference (outside try-catch as it's independent)
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  });

  // Auto save on toggle changes
  ['background', 'flag'].forEach(id => {
    document.getElementById(id).addEventListener('change', async () => {
      try {
        const config = await getCurrentConfig();
        config[id] = document.getElementById(id).checked ? 'enabled' : 'disabled';
        saveConfig(config);
      } catch (error) {
        showError('Failed to save settings');
      }
    });
  });

  // Navbar style (auto save)
  document.querySelectorAll('input[name="style"]').forEach(input => {
    input.addEventListener('change', async () => {
      if (!input.checked) return;
      currentStyle = input.value;
      if (currentRegion) updatePreview();
      try {
        const config = await getCurrentConfig();
        config.style = currentStyle;
        saveConfig(config);
      } catch (error) {
        showError('Failed to save settings');
      }
    });
  });

  // Custom dropdown functionality
  const selectTrigger = regionSelect.querySelector('.select-trigger');
  const selectText = regionSelect.querySelector('.select-text');

  // Keyboard focus stays on the combobox. The active option is the one that the
  // arrow keys point to; aria-activedescendant tells screen readers which one.
  const options = Array.from(optionsList.querySelectorAll('.select-option'));
  let activeIndex = -1;

  const setActiveOption = (index) => {
    activeIndex = index;
    options.forEach((opt, i) => opt.classList.toggle('focused', i === index));
    if (index >= 0) {
      regionSelect.setAttribute('aria-activedescendant', options[index].id);
      options[index].scrollIntoView({ block: 'nearest' });
    } else {
      regionSelect.removeAttribute('aria-activedescendant');
    }
  };

  // Open or close the list. An opened list starts at the selected region.
  const toggleDropdown = (open) => {
    const isOpen = open !== undefined ? open : regionSelect.getAttribute('aria-expanded') !== 'true';
    regionSelect.setAttribute('aria-expanded', isOpen);
    regionSelect.classList.toggle('open', isOpen);
    setActiveOption(isOpen ? options.findIndex(opt => opt.classList.contains('selected')) : -1);
  };

  const selectRegion = (option) => {
    const region = option.getAttribute('data-value');
    if (!isValidRegion(region)) return;

    // Update displayed text with flag
    const flagImg = option.querySelector('.region-flag').cloneNode(true);
    const text = option.querySelector('span').textContent;
    selectText.innerHTML = '';
    selectText.appendChild(flagImg);
    selectText.appendChild(document.createTextNode(text));

    // Update current region and load colors
    currentRegion = region;
    loadRegionColors(region).catch(() => {
      showError('Failed to load region colors');
    });
    document.getElementById('color-editor').classList.remove('hidden');

    options.forEach(opt => {
      opt.setAttribute('aria-selected', opt === option);
      opt.classList.toggle('selected', opt === option);
    });
  };

  selectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  optionsList.addEventListener('click', (e) => {
    const option = e.target.closest('.select-option');
    if (option) selectRegion(option);
    toggleDropdown(false);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!regionSelect.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  // Keyboard: Enter/Space select the active option (or open the list),
  // arrows/Home/End move, Escape closes, Tab closes and moves on.
  regionSelect.addEventListener('keydown', (e) => {
    const isOpen = regionSelect.getAttribute('aria-expanded') === 'true';
    const last = options.length - 1;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          selectRegion(options[activeIndex]);
          toggleDropdown(false);
        } else {
          toggleDropdown();
        }
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          toggleDropdown(true);
        } else if (activeIndex === -1) {
          setActiveOption(e.key === 'ArrowDown' ? 0 : last);
        } else {
          const step = e.key === 'ArrowDown' ? 1 : -1;
          setActiveOption((activeIndex + step + options.length) % options.length);
        }
        break;
      case 'Home':
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setActiveOption(e.key === 'Home' ? 0 : last);
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          toggleDropdown(false);
        }
        break;
      case 'Tab':
        if (isOpen) toggleDropdown(false);
        break;
    }
  });

  // Add color button
  document.getElementById('add-color-btn').addEventListener('click', () => {
    if (currentColors.length < 4) {
      currentColors.push('#888888');
      renderColorInputs();
      updatePreview();
    }
  });

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (!currentRegion || !isValidRegion(currentRegion)) return;

    try {
      const config = await getCurrentConfig();
      if (config.customColors && config.customColors[currentRegion]) {
        delete config.customColors[currentRegion];
        if (Object.keys(config.customColors).length === 0) {
          delete config.customColors;
        }
        saveConfig(config, `Default colors restored for ${currentRegion}.`);
      }
      await loadRegionColors(currentRegion);
    } catch (error) {
      showError('Failed to reset colors');
    }
  });

  // Apply button
  document.getElementById('apply-btn').addEventListener('click', async () => {
    if (!currentRegion || !isValidRegion(currentRegion)) {
      showError('Invalid region selected');
      return;
    }

    // An invalid hex field does not change its color, so applying would save a
    // color that the field does not show.
    const invalidInput = document.querySelector('.hex-input[aria-invalid="true"]');
    if (invalidInput) {
      showError(`Color ${invalidInput.dataset.colorNum}: enter a hex color such as #ff9900.`);
      invalidInput.focus();
      return;
    }

    // Validate all colors
    const validColors = currentColors.filter(c => isValidHexColor(c));
    if (validColors.length < 2) {
      showError('At least 2 valid colors required');
      return;
    }

    try {
      const config = await getCurrentConfig();
      if (!config.customColors) {
        config.customColors = {};
      }
      config.customColors[currentRegion] = {
        color1: validColors[0] || null,
        color2: validColors[1] || null,
        color3: validColors[2] || null,
        color4: validColors[3] || null,
      };
      saveConfig(config, `Colors applied to ${currentRegion}.`);
    } catch (error) {
      showError('Failed to apply colors');
    }
  });

  // Theme toggle (hover effect handled by CSS)
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
});

async function loadRegionColors(region) {
  if (!isValidRegion(region)) {
    throw new Error(`Invalid region: ${region}`);
  }

  const config = await getCurrentConfig();
  currentColors = getRegionColors(validateConfig(config), region);

  renderColorInputs();
  updatePreview();
}

// Create a single color input group element
function createColorInputGroup(color, index, showRemoveBtn) {
  const colorNum = index + 1;
  const inputGroup = document.createElement('div');
  inputGroup.className = 'color-input-group';
  inputGroup.dataset.index = index;
  inputGroup.setAttribute('role', 'group');
  inputGroup.setAttribute('aria-label', `Color ${colorNum} settings`);

  const label = document.createElement('label');
  label.textContent = `Color ${colorNum}`;
  label.id = `color-label-${index}`;

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = color;
  colorInput.className = 'color-picker';
  colorInput.setAttribute('aria-labelledby', `color-label-${index}`);
  colorInput.setAttribute('aria-label', `Color ${colorNum} picker`);
  colorInput.addEventListener('input', (e) => {
    currentColors[index] = e.target.value;
    // Sync hex input
    const hexInput = inputGroup.querySelector('.hex-input');
    if (hexInput) {
      hexInput.value = e.target.value;
      hexInput.removeAttribute('aria-invalid');
    }
    debouncedUpdatePreview();
  });

  const hexInput = document.createElement('input');
  hexInput.type = 'text';
  hexInput.value = color;
  hexInput.className = 'hex-input';
  hexInput.maxLength = 7;
  hexInput.dataset.colorNum = colorNum;
  hexInput.setAttribute('aria-label', `Color ${colorNum} hex value`);
  hexInput.setAttribute('placeholder', '#000000');
  hexInput.addEventListener('input', (e) => {
    const hex = e.target.value;
    if (isValidHexColor(hex)) {
      hexInput.removeAttribute('aria-invalid');
      currentColors[index] = hex;
      colorInput.value = hex;
      debouncedUpdatePreview();
    } else {
      hexInput.setAttribute('aria-invalid', 'true');
    }
  });

  inputGroup.appendChild(label);
  inputGroup.appendChild(colorInput);
  inputGroup.appendChild(hexInput);

  if (showRemoveBtn) {
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-color-btn';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove color ${colorNum}`);
    removeBtn.addEventListener('click', () => {
      currentColors.splice(index, 1);
      renderColorInputs();
      updatePreview();
    });
    inputGroup.appendChild(removeBtn);
  }

  return inputGroup;
}

function renderColorInputs() {
  const container = document.getElementById('color-inputs');
  const showRemoveBtn = currentColors.length > 2;

  // Use DocumentFragment for batch DOM operations
  const fragment = document.createDocumentFragment();
  currentColors.forEach((color, index) => {
    fragment.appendChild(createColorInputGroup(color, index, showRemoveBtn));
  });

  // Single DOM update
  container.innerHTML = '';
  container.appendChild(fragment);

  // Update add button state
  const addBtn = document.getElementById('add-color-btn');
  const isMaxColors = currentColors.length >= 4;
  addBtn.disabled = isMaxColors;
  addBtn.classList.toggle('disabled', isMaxColors);
}

// Show the navbar as the content script draws it: the style's readable
// background and text color, not the raw picker colors.
function updatePreview() {
  const theme = getNavbarTheme(currentColors, currentStyle);
  const preview = document.getElementById('color-preview');
  preview.style.background = theme.accent
    ? `${theme.accent} bottom / 100% ${ACCENT_BAND_HEIGHT} no-repeat, ${theme.background}`
    : theme.background;
  preview.style.color = theme.foreground;
  document.getElementById('preview-flag').src = `flags/${colors[currentRegion].country}.png`;
  document.getElementById('preview-name').textContent = colors[currentRegion].name;
  document.getElementById('contrast-note').hidden = !theme.adjusted;
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  icon.src = `icons/${theme === 'dark' ? 'moon' : 'sun'}.ico`;
}

function getCurrentConfig(forceRefresh = false) {
  // Return cached config if available and refresh not forced
  if (cachedConfig !== null && !forceRefresh) {
    return Promise.resolve(cachedConfig);
  }

  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get('config', (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        cachedConfig = result.config ?? {};
        resolve(cachedConfig);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Save the config. successMessage, when given, is shown after the save.
function saveConfig(config, successMessage = null) {
  // Update cache immediately
  cachedConfig = config;

  try {
    chrome.storage.local.set({ config }, () => {
      if (chrome.runtime.lastError) {
        // Invalidate cache on error
        cachedConfig = null;
        showError(`Failed to save settings: ${chrome.runtime.lastError.message}`);
        return;
      }
      if (successMessage) {
        showStatus(successMessage, 'success');
      }
    });
  } catch (error) {
    cachedConfig = null;
    showError('Failed to save settings');
  }
}
