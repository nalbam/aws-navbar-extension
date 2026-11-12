# Architecture

AWS Colorful Navbar is a browser extension that enhances the AWS Console navigation experience by providing visual cues for different regions.

## Project Structure

```
aws-navbar-extension/
├── manifest.json          # Chrome/Edge Manifest V3
├── manifest-v2.json       # Firefox Manifest V2
├── colors.js              # Region flag colors and navbar themes (shared)
├── utils.js               # Config, region color and region detection helpers (shared)
├── main.js                # Content script (injected into AWS Console)
├── popup.html             # Settings popup UI
├── popup.js               # Popup logic with color customization
├── css/popup.css          # Popup styles
├── flags/                 # Country flag images (128x128 PNG: 27 countries and the globe)
├── icons/                 # UI icons (theme toggle, palette, flag)
├── docs/                  # GitHub Pages homepage (docs/colors.js is a copy of colors.js)
├── specs/                 # Documentation (ARCHITECTURE, CHANGELOG, etc.)
├── tests/                 # Unit tests (node:test, no dependencies)
├── VERSION                # Current version number
└── package.sh             # Release packaging script
```

## Core Components

### 1. Manifest (manifest.json)
- Defines extension metadata, permissions, and resource access
- Permissions: `storage`
- Host permissions: none. A content script declared in the manifest does not need one. Site access comes from the content script `matches` (`*://*.console.aws.amazon.com/*`); the browser shows it as access to read and change data on console.aws.amazon.com sites.
- Web accessible resources: `flags/*.png` for AWS Console pages (the flag images that the content script adds)
- Supports Manifest V3 specification (Chrome, Edge)
- Manifest V2 (`manifest-v2.json`) for Firefox compatibility

### 2. Content Script (main.js)
- Injected into all AWS Console pages
- Owns the navbar background and the text color drawn directly on it. AWS renders the navbar with React and can re-render it at any time, so all changes go through one idempotent `sync()`.
- `sync()` runs:
  - once when `#awsc-navigation-container` exists (a MutationObserver waits for it)
  - after DOM changes in the navigation container (MutationObserver, batched with `requestAnimationFrame`)
  - after a page title change (global services set `| Global` after the first render)
  - after a window resize (the AWS "more" menu collapses at small widths without a DOM change)
  - after a config change in `chrome.storage.local`
- `sync()` disconnects the container observer while it writes, so its own changes do not start another sync.
- Steps of `sync()`:
  1. `detectRegion(location.hostname, document.title)` (utils.js)
  2. `applyTheme()`: sets `--aws-navbar-bg`, `--aws-navbar-fg` and `--aws-navbar-accent` on the `nav` and adds the class `aws-navbar-themed`. One injected stylesheet (`#aws-navbar-styles`) uses these variables.
  3. `markForeground()`: marks gray text and gray SVG shapes whose nearest painted ancestor is the navbar (`data-aws-navbar-color`, `-fill`, `-stroke`). The stylesheet gives marked elements the theme text color. Elements under another surface keep the AWS colors: menus, the search field (`#aws-unified-search-container`) and the AWS account color label. A background color that cannot be parsed counts as a surface. Colored items (logo smile, service icons, links) are not gray and are not marked. The marks are measured with the theme class removed, so they follow the AWS colors and not the colors of earlier marks.
  4. `applyFlag()`: flag image before the region name in the region button. The image is decorative (`alt=""`, `aria-hidden`), because the button already names the region.
  5. `decorateRegionMenu()`: flag image before each region name in the region menu.
  6. `createSnowfall()`: Christmas snow effect (Dec 20-26), in the theme text color. Removed with the theme when the background is disabled.
- Debug logging with `isDebug` flag

#### AWS account color
The AWS Console can show an account color: a 4px stripe above the navbar and a colored account name label. The extension does not paint the stripe or the label. Use the account color to identify the account and the extension to identify the region.

### 3. Popup Interface (popup.html, popup.js, css/popup.css)
- Settings management interface
- Features:
  - Toggle switches for Background and Flag
  - Navbar style selector (Vivid / Subtle)
  - Region selector dropdown (34 regions and Global). Keyboard: arrows, Home/End, Enter/Space to select, Escape or Tab to close
  - Color picker UI with 2-4 gradient colors
  - Real-time navbar preview with the readable theme colors, and a note when colors are adjusted
  - Reset to default per region
  - Apply button to save custom colors. An invalid hex value blocks Apply.
  - Status message (`role="status"`) for applied, reset and error results
  - Dark/Light theme switcher
  - Version display from manifest
- Responsive design with theme support

### 4. Shared Utilities (utils.js)
- Used by main.js and popup.js. Loaded after colors.js.
- Key functions:
  - `isValidHexColor()`: Validates hex color format (#RRGGBB)
  - `isValidRegion()`: Validates region code exists in colors object
  - `validateConfig()`: Validates and sanitizes config structure
  - `getNavbarStyle()`: Navbar style of a config (default `vivid`)
  - `getRegionColors()`: Custom colors of a region when 2 or more are set, else the default flag colors
  - `detectRegion()`: Region shown by the console page (see Region Detection)
  - `debounce()`: Limits function execution rate

### 5. Configuration Storage
- `chrome.storage.local.config`: Feature settings and custom colors
- `localStorage.theme`: Theme preference (dark/light)
- Config structure:
```javascript
{
  "background": "enabled" | "disabled",
  "flag": "enabled" | "disabled",
  "style": "vivid" | "subtle",   // default: "vivid"
  "customColors": {
    "us-east-1": {
      "color1": "#0000aa",
      "color2": "#ee2244",
      "color3": null,
      "color4": null
    }
    // Only customized regions are stored
  }
}
```

### 6. Static Resources
- `flags/`: Flag images (27 countries and the globe, 128x128 PNG)
- `icons/`: UI icons (theme toggle, palette, flag)
- `colors.js`: Shared color data (34 regions and Global) and navbar themes (`getNavbarTheme()`)

## Features

### Region Visualization
- 34 AWS regions and Global with default color gradients inspired by their flags
- Global services (IAM, CloudFront, Route 53, ...) use globe colors (ocean blue to land green)
- User can customize gradient colors per region (2-4 colors)
- Region flags next to the region selector and in the region menu
- Christmas season snow effect (Dec 20-26)

### Navbar Styles and Readability
- `colors` holds flag colors. A flag can contain white, yellow or navy, so the raw colors are not always readable behind text.
- `getNavbarTheme(flagColors, style)` converts flag colors into a navbar theme:

| Style | Text color | Background |
|-------|------------|------------|
| `vivid` (default) | white `#ffffff` | Flag colors. A color that is too light is mixed with black until it is readable. |
| `subtle` | dark `#16191f` | Flag colors mixed 35% into white. A 4px band of the pure flag colors at the bottom. |

- Contract: every gradient color has a contrast ratio of at least 4.5:1 with the text color (WCAG 2.x AA for normal text). The same function draws the popup preview and the homepage header.
- The contrast is checked after 8-bit rounding, and the unit tests sample the rendered gradients.

### Region Detection
- `detectRegion(hostname, title)`:
  1. A page title that ends with `| Global` is a global service. The console runs global services on us-east-1 hosts, but it ends their titles with `| Global`. The suffix is not translated: the Korean console ends the titles of IAM, CloudFront, Route 53, Billing and Organizations with `| Global`. Other console languages are not checked.
  2. Else the region is the host name label before `.console.aws.amazon.com`: `<region>.console.aws.amazon.com` or `<account-alias>.<region>.console.aws.amazon.com`.
  3. Else no region: the extension does not change the page.

### Color Customization (v2.0)
- Per-region color picker UI
- 2-4 gradient colors supported
- Real-time preview
- Reset to default per region
- Persistent storage of custom colors

### Popup Theme
- Dark/Light mode for the popup
- Theme persistence across sessions

## Technical Details

### Storage
- Uses chrome.storage.local for extension settings
- Uses localStorage for theme preference
- Minimal storage footprint (only custom colors stored)
- Backward compatible with v1.x config

### Performance
- One `sync()` reads the computed style of the navbar elements that are not under another surface (about 150 of about 950 elements in the navbar).
- Measured in the Korean console (EC2 dashboard, Chrome, 2026-11-12), `sync()` with forced layout, 30 runs: median 0.8 ms, p90 1.8 ms, max 2.4 ms. Right after AWS opens a menu (style recalculation): up to 8 ms. The previous version (2.2.2) applied once in 0.2 ms median and did not react to re-renders.
- Syncs are batched with `requestAnimationFrame`. A title observer reacts only to a title change, not to other `<head>` changes.
- Debounced color preview updates in the popup (50ms delay)

### Security
- Minimal permissions required:
  - storage: For configuration storage
- No host permissions. Site access is limited to the content script matches (AWS Console domains).
- Input validation for color values

### User Experience
- Instant settings application (no page refresh needed)
- Live updates for Background, Flag and Style settings
- Auto-save for toggles
- Real-time preview for colors
- Visual feedback for actions
- Smooth transitions
- Responsive interface
- Accessible UI: ARIA labels and roles, visible keyboard focus, text contrast of 4.5:1 or more

### Error Handling
- Config values are validated; invalid values are dropped and the defaults apply
- Color validation (hex format)
- The content script does nothing on pages without a known region or without the AWS navbar
- Error messages in the popup status message; they stay until the next result

## Development

### Build & Release
```bash
./package.sh  # Creates release packages
```
- **Version Management**: The `VERSION` file is the single source of truth for version numbers
  - `package.sh` writes the `VERSION` value into the `manifest.json` of each package. The manifests in the repository are not changed.
  - Do NOT manually edit version in manifest files
- Generates two zip files in `./release/`:
  - `aws-navbar-extension-{version}.zip` (Manifest V3 for Chrome/Edge)
  - `aws-navbar-extension-{version}-mv2.zip` (Manifest V2 for Firefox)
- Only the files that the extension uses are packaged (`flags/README.md` is not)
- Requires `jq` and `zip`

### Tests
```bash
node --test   # Node.js 20+, finds tests/*.test.js; no dependencies
```
- `tests/colors.test.js`: every default region gradient and extreme custom colors keep a 4.5:1 contrast in both styles; every region has a flag image
- `tests/utils.test.js`: region detection, config validation, region colors
- `tests/repo.test.js`: JavaScript syntax; `docs/colors.js` equals `colors.js`; every file that a manifest or `popup.html` loads exists and is in the `ITEMS` of `package.sh`; both manifests run the same content scripts; every flag image belongs to a region and has a homepage copy

### Local Testing
1. Chrome/Edge: `chrome://extensions` → Developer Mode → Load Unpacked
2. Firefox: `about:debugging` → This Firefox → Load Temporary Add-on

### CI/CD
- `.github/workflows/test.yml`: on pull requests and pushes to `main`, runs `node --test`
- `.github/workflows/push.yml`: on `VERSION` changes to `main`, runs `node --test`, packages the extension and creates a GitHub release. A failed test stops the release.
- Chrome Web Store and Firefox Add-ons uploads are manual
