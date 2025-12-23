# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWS Colorful Navbar is a browser extension that enhances AWS Console by displaying region-based navbar colors, country flags, account info labels, and service-specific favicons.

## Documentation

- `docs/ARCHITECTURE.md` - Detailed architecture and feature documentation
- `docs/CHANGELOG.md` - Version history and release notes
- `flags/README.md` - Supported regions and flag mappings

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
- Detects region from URL using regex, handles both standard URLs (`region.console.aws.amazon.com`) and account-specific URLs (`account-string.region.console.aws.amazon.com`)
- Applies visual customizations based on `config` from `chrome.storage.local`
- `colors` object maps AWS region codes to country names, CSS gradients, and emojis
- `langs` object handles region name translations for Korean/Japanese

**Popup Interface (`popup.js`, `popup.html`, `css/popup.css`)**
- Settings UI for toggling features (background, flag, favicon)
- Account info management with dynamic entry creation
- Theme toggle with localStorage persistence
- Auto-saves toggle changes immediately

**Background Script (`background.js`)**
- Minimal initialization on extension install

### Storage

| Storage Type | Purpose |
|--------------|---------|
| `chrome.storage.local.config` | Feature toggles and account info mappings |
| `localStorage.theme` | Dark/light theme preference |

### Config Structure
```javascript
{
  "background": "enabled" | "disabled",
  "flag": "enabled" | "disabled",
  "favicon": "enabled" | "disabled",
  "info": {
    "123456789012": "PROD",  // account_id (no hyphens) → display label
    "987654321098": "DEV"
  }
}
```

### Static Resources
- `flags/` - Country flag images (20x20 PNG)
- `svgs/` - AWS service icons for favicons
- `icons/` - UI icons for popup

### Manifest Versions
- `manifest.json` - Manifest V3 (Chrome, Edge)
- `manifest-v2.json` - Manifest V2 (Firefox compatibility)

## Adding New AWS Regions

1. Add region entry to `colors` object in `main.js` with:
   - `country`: matching flag filename (without .png)
   - `background`: CSS gradient string
   - `emoji`: country flag emoji
2. Add flag image to `flags/` directory if new country
