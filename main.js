const colors = {
  'N. Virginia': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #e6194b)',
    'flag': '🇺🇸'
  },
  'Ohio': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #3cb44b)',
    'flag': '🇺🇸'
  },
  'N. California': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #e58e00)',
    'flag': '🇺🇸'
  },
  'Oregon': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #4363d8)',
    'flag': '🇺🇸'
  },
  'Cape Town': {
    'country': 'south-africa',
    'background': 'linear-gradient(to right, #9d6100, #d60000, #008a67, #273790)',
    'flag': '🇿🇦'
  },
  'Hong Kong': {
    'country': 'hong-kong',
    'background': 'linear-gradient(to right, #c9001a, #fcaeb6, #c9001a)',
    'flag': '🇭🇰'
  },
  'Jakarta': {
    'country': 'indonesia',
    'background': 'linear-gradient(to right, #f50003, #e3e2e2)',
    'flag': '🇮🇩'
  },
  'Mumbai': {
    'country': 'india',
    'background': 'linear-gradient(to right, #f98000, #c1bbe5, #009200)',
    'flag': '🇮🇳'
  },
  'Osaka': {
    'country': 'japan',
    'background': 'linear-gradient(to right, #d8d8d8, #d70048, #b87b00)',
    'flag': '🇯🇵'
  },
  'Seoul': {
    'country': 'south-korea',
    'background': 'linear-gradient(to right, #e30423, #00009b)',
    'flag': '🇰🇷'
  },
  'Singapore': {
    'country': 'singapore',
    'background': 'linear-gradient(to right, #e7b2b5, #ff3047, #ccc8a0)',
    'flag': '🇸🇬'
  },
  'Sydney': {
    'country': 'australia',
    'background': 'linear-gradient(to right, #00205b, #ef3340, #000080)',
    'flag': '🇦🇺'
  },
  'Tokyo': {
    'country': 'japan',
    'background': 'linear-gradient(to right, #d8d8d8, #d70048, #dfdfdf)',
    'flag': '🇯🇵'
  },
  'Central': {
    'country': 'canada',
    'background': 'linear-gradient(to right, #f60000, #ffdfe0, #f60000)',
    'flag': '🇨🇦'
  },
  'Frankfurt': {
    'country': 'germany',
    'background': 'linear-gradient(to right, #181d1d, #eb3d00, #dd9400)',
    'flag': '🇩🇪'
  },
  'Ireland': {
    'country': 'ireland',
    'background': 'linear-gradient(to right, #009555, #aaaaaa, #ec6b00)',
    'flag': '🇮🇪'
  },
  'London': {
    'country': 'united-kingdom',
    'background': 'linear-gradient(to right, #194171, #ef3340, #075aaa)',
    'flag': '🇬🇧'
  },
  'Milan': {
    'country': 'italy',
    'background': 'linear-gradient(to right, #008639, #aaaaaa, #c80d2e)',
    'flag': '🇮🇹'
  },
  'Paris': {
    'country': 'france',
    'background': 'linear-gradient(to right, #00569b, #aaaaaa, #f31c21)',
    'flag': '🇫🇷'
  },
  'Stockholm': {
    'country': 'sweden',
    'background': 'linear-gradient(to right, #004ca8, #fccc00, #004ca8)',
    'flag': '🇸🇪'
  },
  'Bahrain': {
    'country': 'bahrain',
    'background': 'linear-gradient(to right, #9ea0a1, #e70e3b, #9e112b)',
    'flag': '🇧🇭'
  },
  'São Paulo': {
    'country': 'brazil',
    'background': 'linear-gradient(to right, #009a4a, #fed500, #009042)',
    'flag': '🇧🇷'
  },
  'Global': {
    'country': 'global',
    'background': 'linear-gradient(to right, #0575e6, #159957)',
    'flag': '🌍'
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

// region
let region = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText;
console.log(`region: ${region}`);

// lang
const lang = document.documentElement.lang;
if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(region)) {
  region = langs[lang][region];
  console.log(`region: ${region}`);
}

// account_id
const account_menu = document.querySelector('div[data-testid=account-detail-menu]>div>div');
const account_id = account_menu.children[1].innerText.replaceAll('-', '');
console.log(`account_id: ${account_id}`);

// load
chrome.storage.local.get('config', (c) => {
  const config = c.config !== undefined ? c.config : {};
  console.log(`config: ${JSON.stringify(config, null, 2)}`);

  if (colors.hasOwnProperty(region)) {
    // region header background
    if (config['background'] !== 'disabled') {
      document.querySelector("#awsc-navigation-container>div>header>nav").style.background = colors[region]['background'];
    }

    // region flag
    if (config['flag'] !== 'disabled') {
      const img = `https://nalbam.github.io/aws-navbar-extension/flags/flag-${colors[region]['country']}.png`;
      document.querySelector('[data-testid="awsc-nav-regions-menu-button"]').insertAdjacentHTML("beforeBegin", `<span style='line-height:1.5em;margin-right:0.3em;'><img src="${img}" style="width:20px;height:20px;"></span>`);
    }
  }

  // account info
  if (config['info'] !== undefined && config['info'][account_id] !== undefined) {
    document.querySelector('[data-testid="awsc-nav-account-menu-button"]').insertAdjacentHTML("beforeBegin", `<span style='font-size:1.8em;margin-right:0.2em;'>${config['info'][account_id]}</span>`);
  }
});
