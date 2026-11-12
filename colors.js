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
    colors: ['#000088', '#ee0000', '#aaaacc'],
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

// Build a left-to-right CSS gradient from an array of hex colors.
function buildGradient(colorList) {
  return `linear-gradient(to right, ${colorList.join(', ')})`;
}

// ============================================
// Navbar themes
// ============================================
//
// The `colors` above are flag colors. They are not always readable behind text:
// a flag can contain white, yellow or navy. A navbar style converts each flag
// color into a background color that keeps the style's text color readable.
//
// Contract: every color of `background` has a contrast ratio of at least
// MIN_TEXT_CONTRAST with `foreground` (WCAG 2.x AA for normal text).

const MIN_TEXT_CONTRAST = 4.5;

// mix: start ratio of `base` in the background color (0 = pure flag color).
// When the start color is not readable, more `base` is mixed in until it is.
const NAVBAR_STYLES = {
  // Saturated flag colors with white text. Light colors are shaded.
  vivid: { foreground: '#ffffff', base: '#000000', mix: 0 },
  // Pastel flag colors with dark text, plus a thin band of the pure flag colors.
  subtle: { foreground: '#16191f', base: '#ffffff', mix: 0.65 },
};

const DEFAULT_NAVBAR_STYLE = 'vivid';

const ACCENT_BAND_HEIGHT = '4px';

function hexToRgb(hex) {
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
}

function rgbToHex(rgb) {
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

// Mix `a` toward `b` by ratio t (0 = a, 1 = b) in sRGB, rounded to 8-bit channels.
function mixRgb(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

// WCAG 2.x relative luminance of an sRGB color.
function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG 2.x contrast ratio between two sRGB colors (1 to 21).
function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Return the color nearest to `hex` (toward the style base) that is readable
// behind the style foreground. Binary search on the mix ratio; each candidate
// is tested after rounding, so the result always meets MIN_TEXT_CONTRAST.
function readableColor(hex, style) {
  const source = hexToRgb(hex);
  const base = hexToRgb(style.base);
  const foreground = hexToRgb(style.foreground);
  const isReadable = t => contrastRatio(mixRgb(source, base, t), foreground) >= MIN_TEXT_CONTRAST;

  if (isReadable(style.mix)) {
    return rgbToHex(mixRgb(source, base, style.mix));
  }
  let low = style.mix;
  let high = 1;
  for (let i = 0; i < 16; i++) {
    const middle = (low + high) / 2;
    if (isReadable(middle)) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return rgbToHex(mixRgb(source, base, high));
}

// Convert flag colors into the navbar theme of a style.
// Returns { style, foreground, background, accent, adjusted }:
// - background: CSS gradient behind the navbar text
// - accent: CSS gradient of the pure flag colors for the subtle band, or null
// - adjusted: true when a color was changed beyond the style's normal mix
function getNavbarTheme(flagColors, styleName) {
  const style = NAVBAR_STYLES[styleName];
  if (!style) {
    throw new Error(`Unknown navbar style: ${styleName}`);
  }
  const backgroundColors = flagColors.map(hex => readableColor(hex, style));
  const plainColors = flagColors.map(hex => rgbToHex(mixRgb(hexToRgb(hex), hexToRgb(style.base), style.mix)));
  return {
    style: styleName,
    foreground: style.foreground,
    background: buildGradient(backgroundColors),
    accent: styleName === 'subtle' ? buildGradient(flagColors) : null,
    adjusted: backgroundColors.some((hex, i) => hex !== plainColors[i]),
  };
}
