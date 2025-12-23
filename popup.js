// colors.js is loaded before this script

let currentRegion = null;
let currentColors = [];

document.addEventListener('DOMContentLoaded', () => {
  // Set version from manifest
  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => response.json())
    .then(manifest => {
      document.querySelector('.version').textContent = `v${manifest.version}`;
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
  chrome.storage.local.get('config', (c) => {
    const config = c.config !== undefined ? c.config : {};

    // Set checkbox states
    document.getElementById('background').checked = config['background'] !== 'disabled';
    document.getElementById('flag').checked = config['flag'] !== 'disabled';

    // Load theme preference
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  });

  // Auto save on toggle changes
  ['background', 'flag'].forEach(id => {
    document.getElementById(id).addEventListener('change', async () => {
      const config = await getCurrentConfig();
      config[id] = document.getElementById(id).checked ? 'enabled' : 'disabled';
      saveConfig(config);
    });
  });

  // Region select change
  document.getElementById('region-select').addEventListener('change', (e) => {
    const region = e.target.value;
    if (region) {
      currentRegion = region;
      loadRegionColors(region);
      document.getElementById('color-editor').classList.remove('hidden');
    } else {
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
    if (currentRegion) {
      const config = await getCurrentConfig();
      if (config.customColors && config.customColors[currentRegion]) {
        delete config.customColors[currentRegion];
        if (Object.keys(config.customColors).length === 0) {
          delete config.customColors;
        }
        saveConfig(config);
      }
      loadRegionColors(currentRegion);
    }
  });

  // Apply button
  document.getElementById('apply-btn').addEventListener('click', async () => {
    if (currentRegion && currentColors.length >= 2) {
      const config = await getCurrentConfig();
      if (!config.customColors) {
        config.customColors = {};
      }
      config.customColors[currentRegion] = {
        color1: currentColors[0] || null,
        color2: currentColors[1] || null,
        color3: currentColors[2] || null,
        color4: currentColors[3] || null,
      };
      saveConfig(config, true);
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
  const config = await getCurrentConfig();

  // Check if custom colors exist for this region
  if (config.customColors && config.customColors[region]) {
    const custom = config.customColors[region];
    currentColors = [custom.color1, custom.color2, custom.color3, custom.color4].filter(c => c);
  } else {
    // Use default colors from shared colors.js
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
  return new Promise(resolve => {
    chrome.storage.local.get('config', (c) => {
      const config = c.config !== undefined ? c.config : {};
      resolve(config);
    });
  });
}

function saveConfig(config, showSaveMessage = false) {
  chrome.storage.local.set({ config }, () => {
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
}
