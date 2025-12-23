// colors.js is loaded before this script

let currentRegion = null;
let currentColors = [];

// ============================================
// Validation Utilities
// ============================================

// Validate hex color format
function isValidHexColor(color) {
  return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
}

// Validate region code exists in colors object
function isValidRegion(region) {
  return region && typeof region === 'string' && colors.hasOwnProperty(region);
}

// Show error message to user
function showError(message) {
  console.error(message);
  const btn = document.getElementById('apply-btn');
  if (btn) {
    const originalContent = btn.textContent;
    btn.textContent = 'Error!';
    btn.classList.add('error');
    setTimeout(() => {
      btn.textContent = originalContent;
      btn.classList.remove('error');
    }, 2000);
  }
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

  // Populate region dropdown
  const regionSelect = document.getElementById('region-select');
  Object.keys(colors).sort().forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = `${colors[region].emoji} ${region} - ${colors[region].name}`;
    regionSelect.appendChild(option);
  });

  // Load saved settings
  chrome.storage.local.get('config', (result) => {
    try {
      if (chrome.runtime.lastError) {
        console.error('Error loading config:', chrome.runtime.lastError);
      }
      const config = result.config ?? {};

      // Set checkbox states
      document.getElementById('background').checked = config['background'] !== 'disabled';
      document.getElementById('flag').checked = config['flag'] !== 'disabled';
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

  // Region select change
  document.getElementById('region-select').addEventListener('change', (e) => {
    const region = e.target.value;
    if (region && isValidRegion(region)) {
      currentRegion = region;
      loadRegionColors(region).catch(error => {
        showError('Failed to load region colors');
      });
      document.getElementById('color-editor').classList.remove('hidden');
    } else {
      currentRegion = null;
      document.getElementById('color-editor').classList.add('hidden');
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
        saveConfig(config);
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
      saveConfig(config, true);
    } catch (error) {
      showError('Failed to apply colors');
    }
  });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  // Theme toggle hover effect
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('mouseenter', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = document.getElementById('theme-icon');
    icon.src = `icons/${currentTheme === 'dark' ? 'moon' : 'sun'}-hover.ico`;
  });

  themeToggle.addEventListener('mouseleave', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateThemeIcon(currentTheme);
  });
});

async function loadRegionColors(region) {
  if (!isValidRegion(region)) {
    throw new Error(`Invalid region: ${region}`);
  }

  const config = await getCurrentConfig();

  // Check if custom colors exist for this region
  if (config.customColors && config.customColors[region]) {
    const custom = config.customColors[region];
    currentColors = [custom.color1, custom.color2, custom.color3, custom.color4]
      .filter(c => c && isValidHexColor(c));
  } else {
    // Use default colors from shared colors.js
    currentColors = [...colors[region].colors];
  }

  // Ensure at least 2 colors
  if (currentColors.length < 2) {
    currentColors = [...colors[region].colors];
  }

  renderColorInputs();
  updatePreview();
}

function renderColorInputs() {
  const container = document.getElementById('color-inputs');
  container.innerHTML = '';

  currentColors.forEach((color, index) => {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'color-input-group';

    const label = document.createElement('label');
    label.textContent = `Color ${index + 1}`;

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = color;
    colorInput.className = 'color-picker';
    colorInput.addEventListener('input', (e) => {
      currentColors[index] = e.target.value;
      updatePreview();
    });

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.value = color;
    hexInput.className = 'hex-input';
    hexInput.maxLength = 7;
    hexInput.addEventListener('input', (e) => {
      const hex = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        currentColors[index] = hex;
        colorInput.value = hex;
        updatePreview();
      }
    });

    inputGroup.appendChild(label);
    inputGroup.appendChild(colorInput);
    inputGroup.appendChild(hexInput);

    // Remove button (only if more than 2 colors)
    if (currentColors.length > 2) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-color-btn';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        currentColors.splice(index, 1);
        renderColorInputs();
        updatePreview();
      });
      inputGroup.appendChild(removeBtn);
    }

    container.appendChild(inputGroup);
  });

  // Update add button state
  const addBtn = document.getElementById('add-color-btn');
  if (currentColors.length >= 4) {
    addBtn.disabled = true;
    addBtn.classList.add('disabled');
  } else {
    addBtn.disabled = false;
    addBtn.classList.remove('disabled');
  }
}

function updatePreview() {
  const preview = document.getElementById('color-preview');
  preview.style.background = buildGradient(currentColors);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  icon.src = `icons/${theme === 'dark' ? 'moon' : 'sun'}.ico`;
}

function getCurrentConfig() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get('config', (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        const config = result.config ?? {};
        resolve(config);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function saveConfig(config, showSaveMessage = false) {
  try {
    chrome.storage.local.set({ config }, () => {
      if (chrome.runtime.lastError) {
        showError('Failed to save settings');
        return;
      }
      if (showSaveMessage) {
        const btn = document.getElementById('apply-btn');
        const originalContent = btn.textContent;
        btn.textContent = 'Applied!';
        btn.classList.add('success');
        setTimeout(() => {
          btn.textContent = originalContent;
          btn.classList.remove('success');
        }, 1000);
      }
    });
  } catch (error) {
    showError('Failed to save settings');
  }
}
