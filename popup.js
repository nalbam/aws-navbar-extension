window.onload = function () {
  let bg_btn = document.getElementById('background');
  let fg_btn = document.getElementById('flag');

  let config = {};

  chrome.storage.local.get('config', (c) => {
    config = c.config !== undefined ? c.config : {};

    if (config['background'] !== 'disabled') {
      bg_btn.checked = true;
    }
    if (config['flag'] !== 'disabled') {
      fg_btn.checked = true;
    }
  });

  bg_btn.onclick = function () {
    console.log(`bg_btn: ${bg_btn.checked}`);

    if (bg_btn.checked) {
      config['background'] = 'enabled';
    } else {
      config['background'] = 'disabled';
    }

    chrome.storage.local.set({ 'config': config });
  }
  fg_btn.onclick = function () {
    console.log(`fg_btn: ${fg_btn.checked}`);

    if (fg_btn.checked) {
      config['flag'] = 'enabled';
    } else {
      config['flag'] = 'disabled';
    }

    chrome.storage.local.set({ 'config': config });
  }
}
