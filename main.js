const colors = {
  'us-east-1': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #e6194b)',
    'emoji': '🇺🇸'
  },
  'us-east-2': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #3cb44b)',
    'emoji': '🇺🇸'
  },
  'us-west-1': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #e58e00)',
    'emoji': '🇺🇸'
  },
  'us-west-2': {
    'country': 'united-states',
    'background': 'linear-gradient(to right, #00009b, #4363d8)',
    'emoji': '🇺🇸'
  },
  'af-south-1': {
    'country': 'south-africa',
    'background': 'linear-gradient(to right, #9d6100, #d60000, #008a67, #273790)',
    'emoji': '🇿🇦'
  },
  'ap-east-1': {
    'country': 'hong-kong',
    'background': 'linear-gradient(to right, #c9001a, #fcaeb6, #c9001a)',
    'emoji': '🇭🇰'
  },
  'ap-southeast-3': {
    'country': 'indonesia',
    'background': 'linear-gradient(to right, #f50003, #e3e2e2)',
    'emoji': '🇮🇩'
  },
  'ap-south-1': {
    'country': 'india',
    'background': 'linear-gradient(to right, #f98000, #c1bbe5, #009200)',
    'emoji': '🇮🇳'
  },
  'ap-northeast-3': {
    'country': 'japan',
    'background': 'linear-gradient(to right, #d8d8d8, #d70048, #b87b00)',
    'emoji': '🇯🇵'
  },
  'ap-northeast-2': {
    'country': 'south-korea',
    'background': 'linear-gradient(to right, #e30423, #00009b)',
    'emoji': '🇰🇷'
  },
  'ap-southeast-1': {
    'country': 'singapore',
    'background': 'linear-gradient(to right, #e7b2b5, #ff3047, #ccc8a0)',
    'emoji': '🇸🇬'
  },
  'ap-southeast-2': {
    'country': 'australia',
    'background': 'linear-gradient(to right, #00205b, #ef3340, #000080)',
    'emoji': '🇦🇺'
  },
  'ap-northeast-1': {
    'country': 'japan',
    'background': 'linear-gradient(to right, #d8d8d8, #d70048, #dfdfdf)',
    'emoji': '🇯🇵'
  },
  'ca-central-1': {
    'country': 'canada',
    'background': 'linear-gradient(to right, #f60000, #ffdfe0, #f60000)',
    'emoji': '🇨🇦'
  },
  'eu-central-1': {
    'country': 'germany',
    'background': 'linear-gradient(to right, #181d1d, #eb3d00, #dd9400)',
    'emoji': '🇩🇪'
  },
  'eu-west-1': {
    'country': 'ireland',
    'background': 'linear-gradient(to right, #009555, #aaaaaa, #ec6b00)',
    'emoji': '🇮🇪'
  },
  'eu-west-2': {
    'country': 'united-kingdom',
    'background': 'linear-gradient(to right, #194171, #ef3340, #075aaa)',
    'emoji': '🇬🇧'
  },
  'eu-south-1': {
    'country': 'italy',
    'background': 'linear-gradient(to right, #008639, #aaaaaa, #c80d2e)',
    'emoji': '🇮🇹'
  },
  'eu-west-3': {
    'country': 'france',
    'background': 'linear-gradient(to right, #00569b, #aaaaaa, #f31c21)',
    'emoji': '🇫🇷'
  },
  'eu-north-1': {
    'country': 'sweden',
    'background': 'linear-gradient(to right, #004ca8, #fccc00, #004ca8)',
    'emoji': '🇸🇪'
  },
  'me-south-1': {
    'country': 'bahrain',
    'background': 'linear-gradient(to right, #9ea0a1, #e70e3b, #9e112b)',
    'emoji': '🇧🇭'
  },
  'sa-east-1': {
    'country': 'brazil',
    'background': 'linear-gradient(to right, #009a4a, #fed500, #009042)',
    'emoji': '🇧🇷'
  },
  'global': {
    'country': 'global',
    'background': 'linear-gradient(to right, #0575e6, #159957)',
    'emoji': '🌍'
  },
}

const langs = {
  'ko': {
    '글로벌': 'Global',
  }
}

const isDebug = true;

// load
chrome.storage.local.get('config', (c) => {
  const config = c.config !== undefined ? c.config : {};
  if (isDebug) console.log(`config: ${JSON.stringify(config, null, 2)}`);

  // city
  let city = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText;

  // lang
  const lang = document.documentElement.lang;
  if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(city)) {
    city = langs[lang][city];
    if (isDebug) console.log(`city: ${city}`);
  }

  // aws service
  let region = undefined;
  let svc = undefined;
  const re = /^https:\/\/([a-z0-9-]+)?(?:\.)?console\.aws\.amazon\.com\/([a-z0-9-]+)\/([a-z0-9]+(?=\/))?.*/;
  const m = re.exec(window.location.href);
  if (m !== undefined && m.length > 2) {
    if (city === 'Global') {
      region = 'global';
    } else {
      region = m[1];
    }
    svc = m[2];
    if (svc === 'codesuite' && m.length > 3) {
      svc = m[3];
    }
  }

  if (isDebug) console.log(`region: ${region}`);
  if (isDebug) console.log(`service: ${svc}`);

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

  // favicon
  if (config['favicon'] !== 'disabled' && svc !== undefined) {
    const x1 = document.querySelector("link[rel*='shortcut icon']");
    if (x1) document.head.removeChild(x1);

    const x2 = document.querySelector("link[rel*='icon']");
    if (x2) document.head.removeChild(x2);

    const link = document.createElement('link');
    link.rel = 'icon';
    if (svc === 'console'  ) {
      link.href = `https://${region}.console.aws.amazon.com/favicon.ico`;
    } else if (svc === 'billing') {
      link.href = `https://us-east-1.console.aws.amazon.com/favicon.ico`;
    } else {
      link.href = `https://nalbam.github.io/aws-navbar-extension/svcs/${svc}.svg`;
    }
    document.head.appendChild(link);
  }
});
