# Architecture

AWS Colorful Navbar is a browser extension that enhances the AWS Console navigation experience by providing visual cues for different regions.

## Project Structure

```
aws-navbar-extension/
├── manifest.json          # Chrome/Edge Manifest V3
├── manifest-v2.json       # Firefox Manifest V2
├── main.js                # Content script (injected into AWS Console)
├── background.js          # Background service worker
├── popup.html             # Settings popup UI
├── popup.js               # Popup logic with color customization
├── css/popup.css          # Popup styles
├── flags/                 # Country flag images (20x20 PNG)
├── icons/                 # UI icons (theme toggle, palette, flag)
├── docs/                  # Documentation
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
- Key functions:
  - `buildGradient()`: Builds CSS gradient from custom color config
- Features:
  - Region detection via URL regex (handles `account-string.region.console.aws.amazon.com` format)
  - Navbar background color customization (default or custom)
  - Region flag display next to region selector
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

### 4. Background Script (background.js)
- Minimal initialization on extension install
- Storage sync initialization

### 5. Configuration Storage
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

### 6. Static Resources
- `flags/`: Country flag images (23 countries)
- `icons/`: UI icons (theme toggle, palette, flag)

## Features

### Region Visualization
- Each AWS region has a unique default color gradient
- User can customize gradient colors per region (2-4 colors)
- Region flags are displayed next to the region selector
- Supports all AWS regions with specific color schemes
- Automatic region detection and display
- Supports both standard URLs and account-specific URLs

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
- Optimized DOM operations

### Security
- Minimal permissions required:
  - activeTab: For current tab manipulation
  - storage: For configuration storage
- Host permissions limited to AWS Console domains
- Input validation for color values

### User Experience
- Instant settings application
- Auto-save for toggles
- Real-time preview for colors
- Visual feedback for actions
- Smooth transitions
- Responsive interface

### Error Handling
- Color validation (hex format)
- Region selector retry mechanism
- Graceful fallbacks to default colors
- Clear error messages

## Development

### Build & Release
```bash
./package.sh  # Creates release packages
```
- Updates version from `VERSION` file into manifest.json
- Generates two zip files in `./release/`:
  - `aws-navbar-extension-{version}.zip` (Manifest V3)
  - `aws-navbar-extension-{version}-mv2.zip` (Manifest V2)
- Requires `jq` for JSON processing

### Local Testing
1. Chrome/Edge: `chrome://extensions` → Developer Mode → Load Unpacked
2. Firefox: `about:debugging` → This Firefox → Load Temporary Add-on

### CI/CD
- GitHub Actions workflow (`.github/workflows/push.yml`)
- Triggers on `VERSION` file changes to `main` branch
- Automatically packages and creates GitHub releases
