// Helper function to create account entry
function createAccountEntry(accountId = '', accountName = '') {
  const entry = document.createElement('div');
  entry.className = 'account-entry';

  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.className = 'account-id';
  idInput.placeholder = 'Account ID';
  idInput.value = accountId;

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'account-name';
  nameInput.placeholder = 'Account Name';
  nameInput.value = accountName;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = '×';
  removeBtn.onclick = () => entry.remove();

  entry.appendChild(idInput);
  entry.appendChild(nameInput);
  entry.appendChild(removeBtn);

  return entry;
}

document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.local.get('config', (c) => {
    const config = c.config !== undefined ? c.config : {};

    // Set checkbox states
    document.getElementById('background').checked = config['background'] !== 'disabled';
    document.getElementById('flag').checked = config['flag'] !== 'disabled';
    document.getElementById('favicon').checked = config['favicon'] !== 'disabled';

    // Set account info
    const accountList = document.getElementById('account_list');
    accountList.innerHTML = ''; // Clear existing entries

    if (config['info']) {
      Object.entries(config['info']).forEach(([accountId, accountName]) => {
        accountList.appendChild(createAccountEntry(accountId, accountName));
      });
    } else {
      accountList.appendChild(createAccountEntry('123456789012', 'PROD'));
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

  // Add Account button
  document.getElementById('add_account_btn').addEventListener('click', () => {
    const accountList = document.getElementById('account_list');
    accountList.appendChild(createAccountEntry());
  });

  // Save account info
  document.getElementById('save_btn').addEventListener('click', async () => {
    const config = await getCurrentConfig();
    const accountEntries = document.querySelectorAll('.account-entry');
    const info = {};

    accountEntries.forEach(entry => {
      const accountId = entry.querySelector('.account-id').value.trim();
      const accountName = entry.querySelector('.account-name').value.trim();

      if (accountId) {
        info[accountId] = accountName;
      }
    });

    config['info'] = info;
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
