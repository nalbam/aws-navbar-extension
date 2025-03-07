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

  // Save settings
  document.getElementById('save_btn').addEventListener('click', () => {
    const config = {
      background: document.getElementById('background').checked ? 'enabled' : 'disabled',
      flag: document.getElementById('flag').checked ? 'enabled' : 'disabled',
      favicon: document.getElementById('favicon').checked ? 'enabled' : 'disabled'
    };

    try {
      const info = document.getElementById('info_area').value.trim();
      if (info) {
        config['info'] = JSON.parse(info);
      }
    } catch (e) {
      alert('Invalid JSON format in Account Info');
      return;
    }

    chrome.storage.local.set({ config }, () => {
      const btn = document.getElementById('save_btn');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
      }, 1000);
    });
  });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
});

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle i');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }
}
