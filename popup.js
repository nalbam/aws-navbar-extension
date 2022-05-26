window.onload = function () {
  let bg_chk = document.getElementById('background');
  let fg_chk = document.getElementById('flag');
  let fv_chk = document.getElementById('favicon');
  let info_v = document.getElementById('info_area');
  let save_b = document.getElementById('save_btn');

  let config = {};

  chrome.storage.local.get('config', (c) => {
    config = c.config !== undefined ? c.config : {};

    if (config['background'] !== 'disabled') {
      bg_chk.checked = true;
    }
    if (config['flag'] !== 'disabled') {
      fg_chk.checked = true;
    }
    if (config['favicon'] !== 'disabled') {
      fv_chk.checked = true;
    }

    if (config['info'] === undefined) {
      config['info'] = {
        '123456789001': 'ALPHA',
        '123456789002': 'PROD',
      }
    }
    info_v.value = JSON.stringify(config['info'], null, 2);
  });

  save_b.onclick = function () {
    config['background'] = bg_chk.checked ? 'enabled' : 'disabled';
    config['flag'] = fg_chk.checked ? 'enabled' : 'disabled';
    config['favicon'] = fv_chk.checked ? 'enabled' : 'disabled';

    config['info'] = JSON.parse(info_v.value);

    chrome.storage.local.set({ 'config': config });

    info_v.value = JSON.stringify(config['info'], null, 2);
  }
}
