# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWS Colorful Navbar is a browser extension that enhances AWS Console by displaying region-based navbar colors with customizable gradients and country flags.

## Documentation

- `specs/ARCHITECTURE.md` - Detailed architecture and feature documentation
- `specs/CHANGELOG.md` - Version history and release notes
- `specs/STORE_DESCRIPTION.md` - Chrome Web Store description
- `flags/README.md` - Supported regions and flag mappings
- `docs/` - GitHub Pages homepage

## Development Commands

### Local Development
```bash
# No build step required - load extension directly in browser
# Chrome: Navigate to chrome://extensions → Enable Developer Mode → Load Unpacked → Select this directory
# Firefox: Navigate to about:debugging → This Firefox → Load Temporary Add-on → Select manifest.json
```

### Packaging for Release
```bash
./package.sh  # Creates MV3 and MV2 zip files in ./release/
```
Requires `jq` installed. Updates version from `VERSION` file into manifest.json.

## Architecture

### Extension Components

**Content Script (`main.js`)**
- Injected into AWS Console pages (`*://*.console.aws.amazon.com/*`)
- Detects region from URL using regex (handles `account-string.region.console.aws.amazon.com` format)
- Applies navbar colors: custom colors from config or default gradients
- `colors` object maps AWS region codes to country names, default CSS gradients, and emojis
- `buildGradient()` function builds CSS gradient from custom color config

**Popup Interface (`popup.js`, `popup.html`, `css/popup.css`)**
- Settings UI for toggling Background and Flag features
- Region selector dropdown for color customization
- Color picker UI (2-4 gradient colors per region)
- Real-time gradient preview
- Reset to default per region
- Theme toggle with localStorage persistence

**Background Script (`background.js`)**
- Minimal initialization on extension install

### Storage

| Storage Type | Purpose |
|--------------|---------|
| `chrome.storage.local.config` | Feature toggles and custom colors |
| `localStorage.theme` | Dark/light theme preference |

### Config Structure
```javascript
{
  "background": "enabled" | "disabled",
  "flag": "enabled" | "disabled",
  "customColors": {
    "us-east-1": {
      "color1": "#0000aa",
      "color2": "#ee2244",
      "color3": null,  // optional
      "color4": null   // optional
    }
    // Only customized regions are stored
  }
}
```

### Static Resources
- `flags/` - Country flag images (128x128 PNG, displayed at 20x20)
- `icons/` - UI icons for popup (palette, flag, theme toggle)

### Manifest Versions
- `manifest.json` - Manifest V3 (Chrome, Edge)
- `manifest-v2.json` - Manifest V2 (Firefox compatibility)

## Adding New AWS Regions

1. Add region entry to `colors` object in `colors.js` with:
   - `country`: matching flag filename (without .png)
   - `name`: region display name
   - `colors`: array of hex color strings (2-4 colors for gradient)
   - `emoji`: country flag emoji
2. Add flag image to `flags/` directory if new country (see `flags/README.md` for download instructions)
3. Update `flags/README.md` with the new region
