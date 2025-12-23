// Shared color data for all AWS regions
const colors = {
  'af-south-1': {
    country: 'south-africa',
    name: 'South Africa',
    colors: ['#aa6600', '#dd0000', '#008866', '#334488'],
    emoji: '🇿🇦'
  },
  'ap-east-1': {
    country: 'hong-kong',
    name: 'Hong Kong',
    colors: ['#cc0055', '#ff88aa', '#cc0055'],
    emoji: '🇭🇰'
  },
  'ap-east-2': {
    country: 'taiwan',
    name: 'Taiwan (Taipei)',
    colors: ['#ee0000', '#000088', '#aaaacc'],
    emoji: '🇹🇼'
  },
  'ap-northeast-1': {
    country: 'japan',
    name: 'Japan (Tokyo)',
    colors: ['#aa8888', '#dd0044', '#aa8888'],
    emoji: '🇯🇵'
  },
  'ap-northeast-2': {
    country: 'south-korea',
    name: 'South Korea',
    colors: ['#dd0022', '#0000aa'],
    emoji: '🇰🇷'
  },
  'ap-northeast-3': {
    country: 'japan',
    name: 'Japan (Osaka)',
    colors: ['#cc0044', '#aa8888', '#cc0044'],
    emoji: '🇯🇵'
  },
  'ap-south-1': {
    country: 'india',
    name: 'India (Mumbai)',
    colors: ['#f98000', '#8888aa', '#009900'],
    emoji: '🇮🇳'
  },
  'ap-south-2': {
    country: 'india',
    name: 'India (Hyderabad)',
    colors: ['#f98000', '#009900', '#8888aa'],
    emoji: '🇮🇳'
  },
  'ap-southeast-1': {
    country: 'singapore',
    name: 'Singapore',
    colors: ['#cc8888', '#ff3344', '#aa9977'],
    emoji: '🇸🇬'
  },
  'ap-southeast-2': {
    country: 'australia',
    name: 'Australia (Sydney)',
    colors: ['#002255', '#ee3344', '#000088'],
    emoji: '🇦🇺'
  },
  'ap-southeast-3': {
    country: 'indonesia',
    name: 'Indonesia',
    colors: ['#ee0000', '#aa9999'],
    emoji: '🇮🇩'
  },
  'ap-southeast-4': {
    country: 'australia',
    name: 'Australia (Melbourne)',
    colors: ['#002255', '#000088', '#ee3344'],
    emoji: '🇦🇺'
  },
  'ap-southeast-5': {
    country: 'malaysia',
    name: 'Malaysia (Kuala Lumpur)',
    colors: ['#cc0000', '#0033aa', '#ffcc00'],
    emoji: '🇲🇾'
  },
  'ap-southeast-6': {
    country: 'new-zealand',
    name: 'New Zealand (Auckland)',
    colors: ['#002277', '#ee0000', '#aaaacc'],
    emoji: '🇳🇿'
  },
  'ap-southeast-7': {
    country: 'thailand',
    name: 'Thailand (Bangkok)',
    colors: ['#ee0000', '#ffffff', '#002277'],
    emoji: '🇹🇭'
  },
  'ca-central-1': {
    country: 'canada',
    name: 'Canada (Central)',
    colors: ['#ee0000', '#dd6633', '#ee0000'],
    emoji: '🇨🇦'
  },
  'ca-west-1': {
    country: 'canada',
    name: 'Canada (Calgary)',
    colors: ['#dd6633', '#ee0000', '#dd6633'],
    emoji: '🇨🇦'
  },
  'eu-central-1': {
    country: 'germany',
    name: 'Germany',
    colors: ['#222222', '#ee4400', '#dd9900'],
    emoji: '🇩🇪'
  },
  'eu-central-2': {
    country: 'switzerland',
    name: 'Switzerland (Zurich)',
    colors: ['#dd0033', '#aa8888', '#dd0022'],
    emoji: '🇨🇭'
  },
  'eu-central-3': {
    country: 'switzerland',
    name: 'Switzerland',
    colors: ['#cc6666', '#dd0033', '#cc6666'],
    emoji: '🇨🇭'
  },
  'eu-north-1': {
    country: 'sweden',
    name: 'Sweden',
    colors: ['#0055aa', '#ffcc00', '#0044aa'],
    emoji: '🇸🇪'
  },
  'eu-south-1': {
    country: 'italy',
    name: 'Italy (Milan)',
    colors: ['#008844', '#aaaaaa', '#cc1133'],
    emoji: '🇮🇹'
  },
  'eu-south-2': {
    country: 'spain',
    name: 'Spain',
    colors: ['#cc1122', '#ffbb00', '#cc1122'],
    emoji: '🇪🇸'
  },
  'eu-south-3': {
    country: 'italy',
    name: 'Italy',
    colors: ['#cc1133', '#aaaaaa', '#008844'],
    emoji: '🇮🇹'
  },
  'eu-west-1': {
    country: 'ireland',
    name: 'Ireland',
    colors: ['#009955', '#aaaaaa', '#ee7700'],
    emoji: '🇮🇪'
  },
  'eu-west-2': {
    country: 'united-kingdom',
    name: 'United Kingdom',
    colors: ['#224477', '#ee3344', '#1166aa'],
    emoji: '🇬🇧'
  },
  'eu-west-3': {
    country: 'france',
    name: 'France',
    colors: ['#005599', '#aaaaaa', '#ee2222'],
    emoji: '🇫🇷'
  },
  'il-central-1': {
    country: 'israel',
    name: 'Israel',
    colors: ['#0038b8', '#8899cc'],
    emoji: '🇮🇱'
  },
  'me-central-1': {
    country: 'uae',
    name: 'UAE',
    colors: ['#ee0000', '#009955', '#222222'],
    emoji: '🇦🇪'
  },
  'me-south-1': {
    country: 'bahrain',
    name: 'Bahrain',
    colors: ['#aa9999', '#ee1144', '#aa1133'],
    emoji: '🇧🇭'
  },
  'me-west-1': {
    country: 'uae',
    name: 'UAE',
    colors: ['#222222', '#009955', '#ee0000'],
    emoji: '🇦🇪'
  },
  'mx-central-1': {
    country: 'mexico',
    name: 'Mexico (Queretaro)',
    colors: ['#006847', '#ffffff', '#ce1126'],
    emoji: '🇲🇽'
  },
  'sa-east-1': {
    country: 'brazil',
    name: 'Brazil',
    colors: ['#009944', '#ffee00', '#002288'],
    emoji: '🇧🇷'
  },
  'us-east-1': {
    country: 'united-states',
    name: 'US East (N. Virginia)',
    colors: ['#0000aa', '#ee2244'],
    emoji: '🇺🇸'
  },
  'us-east-2': {
    country: 'united-states',
    name: 'US East (Ohio)',
    colors: ['#0000aa', '#8888aa', '#cc2244'],
    emoji: '🇺🇸'
  },
  'us-west-1': {
    country: 'united-states',
    name: 'US West (N. California)',
    colors: ['#cc2244', '#8888aa', '#0000aa'],
    emoji: '🇺🇸'
  },
  'us-west-2': {
    country: 'united-states',
    name: 'US West (Oregon)',
    colors: ['#0000aa', '#4466ee'],
    emoji: '🇺🇸'
  },
  'global': {
    country: 'global',
    name: 'Global',
    colors: ['#0077dd', '#119955'],
    emoji: '🌍'
  },
};

// Helper function to build gradient from color array
function buildGradient(colorArray) {
  const colorList = Array.isArray(colorArray) ? colorArray :
    [colorArray.color1, colorArray.color2, colorArray.color3, colorArray.color4].filter(c => c && c !== null);
  return `linear-gradient(to right, ${colorList.join(', ')})`;
}

// Get default gradient for a region
function getDefaultGradient(region) {
  if (colors[region]) {
    return buildGradient(colors[region].colors);
  }
  return null;
}
