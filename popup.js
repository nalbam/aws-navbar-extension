document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.local.get('config', (c) => {
    const config = c.config !== undefined ? c.config : {};

    // Set checkbox states
    document.getElementById('background').checked = config['background'] !== 'disabled';
    document.getElementById('flag').checked = config['flag'] !== 'disabled';
    document.getElementById('favicon').checked = config['favicon'] !== 'disabled';

    // Set account info
    if (config['info']) {
      document.getElementById('info_area').value = JSON.stringify(config['info'], null, 2);
    }

    // Load theme preference
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  });

  // Auto save on toggle changes
  ['background', 'flag', 'favicon'].forEach(id => {
    document.getElementById(id).addEventListener('change', async () => {
      const config = await getCurrentConfig();
      config[id] = document.getElementById(id).checked ? 'enabled' : 'disabled';
      saveConfig(config);
    });
  });

  // Save account info
  document.getElementById('save_btn').addEventListener('click', async () => {
    const config = await getCurrentConfig();

    try {
      const info = document.getElementById('info_area').value.trim();
      if (info) {
        config['info'] = JSON.parse(info);
      }
    } catch (e) {
      alert('Invalid JSON format in Account Info');
      return;
    }

    saveConfig(config, true);
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

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  icon.src = `icons/${theme === 'dark' ? 'moon' : 'sun'}.ico`;
}

// Helper function to get current config
function getCurrentConfig() {
  return new Promise(resolve => {
    chrome.storage.local.get('config', (c) => {
      const config = c.config !== undefined ? c.config : {};
      if (!config.info) {
        config.info = {"123456789012": "PROD"};
      }
      resolve(config);
    });
  });
}

// Helper function to save config
function saveConfig(config, showSaveMessage = false) {
  chrome.storage.local.set({ config }, () => {
    if (showSaveMessage) {
      const btn = document.getElementById('save_btn');
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<img src="icons/floppy-disk.ico" alt="Save" class="icon"> Saved';
      setTimeout(() => {
        btn.innerHTML = originalContent;
      }, 1000);
    }
  });
}
