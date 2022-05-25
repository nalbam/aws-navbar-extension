const colors = {
  'N. Virginia': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #e6194b)',
    'emoji': '🇺🇸'
  },
  'Ohio': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #3cb44b)',
    'emoji': '🇺🇸'
  },
  'N. California': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #e58e00)',
    'emoji': '🇺🇸'
  },
  'Oregon': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #4363d8)',
    'emoji': '🇺🇸'
  },
  'Cape Town': {
    'country': 'south-africa',
    'background': 'linear-gradient(to right, #9d6100, #d60000, #008a67, #273790)',
    'emoji': '🇿🇦'
  },
  'Hong Kong': {
    'country': 'hong-kong',
    'background': 'linear-gradient(to right, #c9001a, #fcaeb6, #c9001a)',
    'emoji': '🇭🇰'
  },
  'Jakarta': {
    'country': 'indonesia',
    'background': 'linear-gradient(to right, #f50003, #e3e2e2)',
    'emoji': '🇮🇩'
  },
  'Mumbai': {
    'country': 'india',
    'background': 'linear-gradient(to right, #f98000, #c1bbe5, #009200)',
    'emoji': '🇮🇳'
  },
  'Osaka': {
    'country': 'japan',
    'background': 'linear-gradient(to right, #d8d8d8, #d70048, #b87b00)',
    'emoji': '🇯🇵'
  },
  'Seoul': {
    'country': 'south-korea',
    'background': 'linear-gradient(to right, #e30423, #00009b)',
    'emoji': '🇰🇷'
  },
  'Singapore': {
    'country': 'singapore',
    'background': 'linear-gradient(to right, #e7b2b5, #ff3047, #ccc8a0)',
    'emoji': '🇸🇬'
  },
  'Sydney': {
    'country': 'australia',
    'background': 'linear-gradient(to right, #00205b, #ef3340, #000080)',
    'emoji': '🇦🇺'
  },
  'Tokyo': {
    'country': 'japan',
    'background': 'linear-gradient(to right, #d8d8d8, #d70048, #dfdfdf)',
    'emoji': '🇯🇵'
  },
  'Central': {
    'country': 'canada',
    'background': 'linear-gradient(to right, #f60000, #ffdfe0, #f60000)',
    'emoji': '🇨🇦'
  },
  'Frankfurt': {
    'country': 'germany',
    'background': 'linear-gradient(to right, #181d1d, #eb3d00, #dd9400)',
    'emoji': '🇩🇪'
  },
  'Ireland': {
    'country': 'ireland',
    'background': 'linear-gradient(to right, #009555, #aaaaaa, #ec6b00)',
    'emoji': '🇮🇪'
  },
  'London': {
    'country': 'united-kingdom',
    'background': 'linear-gradient(to right, #194171, #ef3340, #075aaa)',
    'emoji': '🇬🇧'
  },
  'Milan': {
    'country': 'italy',
    'background': 'linear-gradient(to right, #008639, #aaaaaa, #c80d2e)',
    'emoji': '🇮🇹'
  },
  'Paris': {
    'country': 'france',
    'background': 'linear-gradient(to right, #00569b, #aaaaaa, #f31c21)',
    'emoji': '🇫🇷'
  },
  'Stockholm': {
    'country': 'sweden',
    'background': 'linear-gradient(to right, #004ca8, #fccc00, #004ca8)',
    'emoji': '🇸🇪'
  },
  'Bahrain': {
    'country': 'bahrain',
    'background': 'linear-gradient(to right, #9ea0a1, #e70e3b, #9e112b)',
    'emoji': '🇧🇭'
  },
  'São Paulo': {
    'country': 'brazil',
    'background': 'linear-gradient(to right, #009a4a, #fed500, #009042)',
    'emoji': '🇧🇷'
  },
  'Global': {
    'country': 'global',
    'background': 'linear-gradient(to right, #0575e6, #159957)',
    'emoji': '🌍'
  },
}

const langs = {
  'ko': {
    '버지니아 북부': 'N. Virginia',
    '오하이오': 'Ohio',
    '캘리포니아': 'N. California',
    '오레곤': 'Oregon',
    '케이프타운': 'Cape Town',
    '홍콩': 'Hong Kong',
    '자카르타': 'Jakarta',
    '뭄바이': 'Mumbai',
    '오사카': 'Osaka',
    '서울': 'Seoul',
    '싱가포르': 'Singapore',
    '시드니': 'Sydney',
    '도쿄': 'Tokyo',
    '중부': 'Central',
    '프랑크푸르트': 'Frankfurt',
    '아일랜드': 'Ireland',
    '런던': 'London',
    '밀라노': 'Milan',
    '파리': 'Paris',
    '스톡홀름': 'Stockholm',
    '바레인': 'Bahrain',
    '상파울루': 'São Paulo',
    '글로벌': 'Global',
  }
}

const isDebug = false;

// load
chrome.storage.local.get('config', (c) => {
  const config = c.config !== undefined ? c.config : {};
  if (isDebug) console.log(`config: ${JSON.stringify(config, null, 2)}`);

  // region
  let region = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText;
  if (isDebug) console.log(`region: ${region}`);

  // lang
  const lang = document.documentElement.lang;
  if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(region)) {
    region = langs[lang][region];
    if (isDebug) console.log(`region: ${region}`);
  }

  if (colors.hasOwnProperty(region)) {
    // region header background
    if (config['background'] !== 'disabled') {
      document.querySelector("#awsc-navigation-container>div>header>nav").style.background = colors[region]['background'];
    }

    // region flag
    if (config['flag'] !== 'disabled') {
      const flag = `https://nalbam.github.io/aws-navbar-extension/flags/flag-${colors[region]['country']}.png`;
      document.querySelector('[data-testid="awsc-nav-regions-menu-button"]').insertAdjacentHTML("beforeBegin", `<span style="line-height:0;margin-right:0.5em;"><img src="${flag}" style="width:20px;height:20px;"></span>`);
      // document.querySelector('[data-testid="awsc-nav-regions-menu-button"]').insertAdjacentHTML("beforeBegin", `<span style="font-size:1.8em;margin-right:0.2em;">${colors[region]['emoji']}</span>`);
    }
  }

  // account_id
  const account_menu = document.querySelector('div[data-testid=account-detail-menu]>div>div');
  const account_id = account_menu.children[1].innerText.replaceAll('-', '');
  if (isDebug) console.log(`account_id: ${account_id}`);

  // account info
  if (config['info'] !== undefined && config['info'][account_id] !== undefined) {
    document.querySelector('[data-testid="awsc-nav-account-menu-button"]').insertAdjacentHTML("beforeBegin", `<span style="font-size:1.8em;margin-right:0.2em;">${config['info'][account_id]}</span>`);
  }

  // aws service
  let svc = undefined;
  const re = /^https:\/\/([a-z0-9-]+)?(?:\.)?console\.aws\.amazon\.com\/([a-z0-9-]+)\/([a-z0-9]+(?=\/))?.*/;
  const m = re.exec(window.location.href);
  if (m !== undefined && m.length > 2) {
    svc = m[2];
    if (svc === 'codesuite' && m.length > 3) {
      svc = m[3];
    }
    if (isDebug) console.log(`service: ${svc}`);
  }

  // favicon
  if (config['favicon'] !== 'disabled' && svc !== undefined) {
    const x1 = document.querySelector("link[rel*='shortcut icon']");
    if (x1) document.head.removeChild(x1);

    const x2 = document.querySelector("link[rel*='icon']");
    if (x2) document.head.removeChild(x2);

    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = `https://nalbam.github.io/aws-navbar-extension/svcs/${svc}.png`;
    document.head.appendChild(link);
  }
});
