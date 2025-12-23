# Architecture

AWS Colorful Navbar is a browser extension that enhances the AWS Console navigation experience by providing visual cues for different regions.

## Project Structure

```
aws-navbar-extension/
├── manifest.json          # Chrome/Edge Manifest V3
├── manifest-v2.json       # Firefox Manifest V2
├── colors.js              # Shared color data for all regions
├── utils.js               # Shared validation utilities
├── main.js                # Content script (injected into AWS Console)
├── background.js          # Background service worker
├── popup.html             # Settings popup UI
├── popup.js               # Popup logic with color customization
├── css/popup.css          # Popup styles
├── flags/                 # Country flag images (128x128 PNG, 29 countries)
├── icons/                 # UI icons (theme toggle, palette, flag)
├── docs/                  # GitHub Pages homepage
├── specs/                 # Documentation (ARCHITECTURE, CHANGELOG, etc.)
├── VERSION                # Current version number
└── package.sh             # Release packaging script
```

## Core Components

### 1. Manifest (manifest.json)
- Defines extension metadata, permissions, and resource access
- Permissions: `activeTab`, `storage`
- Host permissions: `*://*.console.aws.amazon.com/*`
- Supports Manifest V3 specification (Chrome, Edge)
- Manifest V2 (`manifest-v2.json`) for Firefox compatibility

### 2. Content Script (main.js)
- Injected into all AWS Console pages
- Key data structures:
  - `colors`: Maps region codes → country, default gradient, emoji
  - `langs`: Korean/Japanese region name translations
  - `domCache`: Cached DOM elements for performance
- Key functions:
  - `buildGradient()`: Builds CSS gradient from custom color config
  - `getCachedElement()`: Returns cached DOM element or queries and caches it
  - `removeNavbarBackground()`: Removes navbar background (for live toggle)
  - `removeRegionFlag()`: Removes flag element (for live toggle)
- Features:
  - Region detection via URL regex (handles `account-string.region.console.aws.amazon.com` format)
  - Navbar background color customization (default or custom)
  - Region flag display next to region selector
  - Live toggle updates (Background/Flag changes apply instantly without refresh)
- Retry mechanism (3 attempts) for region selector detection
- Debug logging with `isDebug` flag

### 3. Popup Interface (popup.html, popup.js, css/popup.css)
- Settings management interface
- Features:
  - Toggle switches for Background and Flag
  - Region selector dropdown (30+ regions)
  - Color picker UI with 2-4 gradient colors
  - Real-time gradient preview
  - Reset to default per region
  - Apply button to save custom colors
  - Dark/Light theme switcher
  - Version display from manifest
- Key data:
  - `defaultColors`: Default gradient colors for all regions
- Responsive design with theme support

### 4. Shared Utilities (utils.js)
- Shared validation and performance functions used by both main.js and popup.js
- Key constants:
  - `HEX_COLOR_REGEX`: Pre-compiled regex for hex color validation
- Key functions:
  - `isValidHexColor()`: Validates hex color format (#RRGGBB)
  - `isValidRegion()`: Validates region code exists in colors object
  - `validateConfig()`: Validates and sanitizes config structure
  - `debounce()`: Limits function execution rate for performance

### 5. Background Script (background.js)
- Minimal initialization on extension install
- Local storage initialization

### 6. Configuration Storage
- `chrome.storage.local.config`: Feature settings and custom colors
- `localStorage.theme`: Theme preference (dark/light)
- Config structure:
```javascript
{
  "background": "enabled" | "disabled",
  "flag": "enabled" | "disabled",
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

### 7. Static Resources
- `flags/`: Country flag images (29 countries, 128x128 PNG)
- `icons/`: UI icons (theme toggle, palette, flag)
- `colors.js`: Shared color data (38 regions)

## Features

### Region Visualization
- 38 AWS regions with unique default color gradients
- User can customize gradient colors per region (2-4 colors)
- Region flags displayed next to the region selector (29 countries)
- Automatic region detection from URL
- Supports both standard URLs and account-specific URLs
- Christmas season snow effect (Dec 20-26)

### Color Customization (v2.0)
- Per-region color picker UI
- 2-4 gradient colors supported
- Real-time preview
- Reset to default per region
- Persistent storage of custom colors

### Theme System
- Dark/Light mode support
- Theme persistence across sessions
- Smooth transition animations
- AWS-inspired color palette
- Accessible color contrasts

### Internationalization
- Support for multiple languages (ko, jp)
- Region name translations
- Global region handling

## Technical Details

### Storage
- Uses chrome.storage.local for extension settings
- Uses localStorage for theme preference
- Minimal storage footprint (only custom colors stored)
- Backward compatible with v1.x config

### Performance
- Asynchronous storage operations
- Efficient resource loading
- Retry mechanism for region detection
- Optimized DOM operations:
  - DOM element caching (`domCache`) to avoid repeated querySelector calls
  - DocumentFragment for batch DOM updates (region dropdown, snowflakes)
  - Debounced color preview updates (50ms delay)
  - Batched style assignments using `cssText`
  - Pre-compiled regex patterns
- Config caching with storage change listener invalidation

### Security
- Minimal permissions required:
  - activeTab: For current tab manipulation
  - storage: For configuration storage
- Host permissions limited to AWS Console domains
- Input validation for color values

### User Experience
- Instant settings application (no page refresh needed)
- Live toggle updates for Background and Flag settings
- Auto-save for toggles
- Real-time preview for colors
- Visual feedback for actions
- Smooth transitions
- Responsive interface
- Accessible UI with ARIA labels and roles

### Error Handling
- Color validation (hex format)
- Region selector retry mechanism
- Graceful fallbacks to default colors
- Flag image error handling with emoji fallback
- Clear error messages with visual feedback

## Development

### Build & Release
```bash
./package.sh  # Creates release packages
```
- **Version Management**: The `VERSION` file is the single source of truth for version numbers
  - `manifest.json` version is automatically updated from `VERSION` during build
  - Do NOT manually edit version in manifest files
- Generates two zip files in `./release/`:
  - `aws-navbar-extension-{version}.zip` (Manifest V3 for Chrome/Edge)
  - `aws-navbar-extension-{version}-mv2.zip` (Manifest V2 for Firefox)
- Requires `jq` for JSON processing

### Local Testing
1. Chrome/Edge: `chrome://extensions` → Developer Mode → Load Unpacked
2. Firefox: `about:debugging` → This Firefox → Load Temporary Add-on

### CI/CD
- GitHub Actions workflow (`.github/workflows/push.yml`)
- Triggers on `VERSION` file changes to `main` branch
- Automatically packages and creates GitHub releases
