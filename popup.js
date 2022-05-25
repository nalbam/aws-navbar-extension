window.onload = function () {
  let bg_chk = document.getElementById('background');
  let fg_chk = document.getElementById('flag');
  let fv_chk = document.getElementById('favicon');
  let info_a = document.getElementById('info_area');
  let info_b = document.getElementById('info_btn');

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
        '123456789001': 'alpha',
        '123456789002': 'prod',
      }
    }
    info_a.value = JSON.stringify(config['info'], null, 2);
  });

  bg_chk.onclick = function () {
    console.log(`bg_chk: ${bg_chk.checked}`);

    if (bg_chk.checked) {
      config['background'] = 'enabled';
    } else {
      config['background'] = 'disabled';
    }

    chrome.storage.local.set({ 'config': config });
  }
  fv_chk.onclick = function () {
    console.log(`fv_chk: ${fv_chk.checked}`);

    if (fv_chk.checked) {
      config['favicon'] = 'enabled';
    } else {
      config['favicon'] = 'disabled';
    }

    chrome.storage.local.set({ 'config': config });
  }
  info_b.onclick = function () {
    console.log(`info_b: ${info_a.value}`);

    config['info'] = JSON.parse(info_a.value);

    chrome.storage.local.set({ 'config': config });

    info_a.value = JSON.stringify(config['info'], null, 2);
  }
}
