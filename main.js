const config = {
  'N. Virginia': {
    'color': '#e6194b',
    'graident': 'linear-gradient(to right, #00009b, #e6194b)',
    'flag': '🇺🇸'
  },
  'Ohio': {
    'color': '#3cb44b',
    'graident': 'linear-gradient(to right, #00009b, #3cb44b)',
    'flag': '🇺🇸'
  },
  'N. California': {
    'color': '#e58e00',
    'graident': 'linear-gradient(to right, #00009b, #e58e00)',
    'flag': '🇺🇸'
  },
  'Oregon': {
    'color': '#4363d8',
    'graident': 'linear-gradient(to right, #00009b, #4363d8)',
    'flag': '🇺🇸'
  },
  'Cape Town': {
    'color': '#16ab3e',
    'graident': '',
    'flag': '🇿🇦'
  },
  'Hong Kong': {
    'color': '#808000',
    'graident': '',
    'flag': '🇭🇰'
  },
  'Jakarta': {
    'color': '#008080',
    'graident': '',
    'flag': '🇮🇩'
  },
  'Mumbai': {
    'color': '#8a7299',
    'graident': 'linear-gradient(to right, #f98000, #009200)',
    'flag': '🇮🇳'
  },
  'Osaka': {
    'color': '#669975',
    'graident': 'linear-gradient(to right, #222222, #d70048, #b87b00)',
    'flag': '🇯🇵'
  },
  'Seoul': {
    'color': '#9a6324',
    'graident': 'linear-gradient(to right, #e30423, #00009b)',
    'flag': '🇰🇷'
  },
  'Singapore': {
    'color': '#ccc8a0',
    'graident': 'linear-gradient(to right, #ff3047, #ccc8a0)',
    'flag': '🇸🇬'
  },
  'Sydney': {
    'color': '#800000',
    'graident': 'linear-gradient(to right, #00205b, #ef3340, #000080)',
    'flag': '🇦🇺'
  },
  'Tokyo': {
    'color': '#669975',
    'graident': 'linear-gradient(to right, #222222, #d70048, #222222)',
    'flag': '🇯🇵'
  },
  'Central': {
    'color': '#f58231',
    'graident': 'linear-gradient(to right, #f60000, #aaaaaa, #f60000)',
    'flag': '🇨🇦'
  },
  'Frankfurt': {
    'color': '#911eb4',
    'graident': 'linear-gradient(to right, #181d1d, #eb3d00, #dd9400)',
    'flag': '🇩🇪'
  },
  'Ireland': {
    'color': '#31a8a8',
    'graident': 'linear-gradient(to right, #009555, #aaaaaa, #ec6b00)',
    'flag': '🇮🇪'
  },
  'London': {
    'color': '#f032e6',
    'graident': 'linear-gradient(to right, #194171, #ef3340, #075aaa)',
    'flag': '🇬🇧'
  },
  'Milan': {
    'color': '#a30f88',
    'graident': 'linear-gradient(to right, #008639, #aaaaaa, #c80d2e)',
    'flag': '🇮🇹'
  },
  'Paris': {
    'color': '#83ac08',
    'graident': 'linear-gradient(to right, #00569b, #aaaaaa, #f31c21)',
    'flag': '🇫🇷'
  },
  'Stockholm': {
    'color': '#c89898',
    'graident': 'linear-gradient(to right, #004ca8, #fccc00, #004ca8)',
    'flag': '🇸🇪'
  },
  'Bahrain': {
    'color': '#808000',
    'graident': '',
    'flag': '🇧🇭'
  },
  'São Paulo': {
    'color': '#009a4a',
    'graident': 'linear-gradient(to right, #009a4a, #fed500, #009a4a)',
    'flag': '🇧🇷'
  },
  'Global': {
    'color': '',
    'graident': 'linear-gradient(to right, #0575e6, #159957)',
    'flag': '🌍'
  }
}

const region = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText;

console.log(`region: ${region}`);

if (config.hasOwnProperty(region)) {
  let color = config[region]['color'];
  let graident = config[region]['graident'];
  let flag = config[region]['flag'];

  /* ------------------------- region Gradient header ------------------------- */
  if (graident === '') {
    document.querySelector("#awsc-navigation-container>div>header>nav").style.backgroundColor = color;
  } else {
    document.querySelector("#awsc-navigation-container>div>header>nav").style.background = graident;
  }

  /* ------------------------------- region emoji flag ------------------------------ */
  document.querySelector('[data-testid="awsc-nav-regions-menu-button"]').insertAdjacentHTML("beforeBegin", "<span style='font-size: 1.8em;line-height: 1em;margin-right:0.2em'>" + flag + "</span>");
}
