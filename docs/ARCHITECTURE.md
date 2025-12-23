# Architecture

AWS Colorful Navbar is a browser extension that enhances the AWS Console navigation experience by providing visual cues for different regions and services.

## Project Structure

```
aws-navbar-extension/
├── manifest.json          # Chrome/Edge Manifest V3
├── manifest-v2.json       # Firefox Manifest V2
├── main.js                # Content script (injected into AWS Console)
├── background.js          # Background service worker
├── popup.html             # Settings popup UI
├── popup.js               # Popup logic
├── css/popup.css          # Popup styles
├── flags/                 # Country flag images (20x20 PNG)
├── svgs/                  # AWS service icons
├── icons/                 # UI icons
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
  - `colors`: Maps region codes → country, gradient, emoji
  - `langs`: Korean/Japanese region name translations
- Features:
  - Region detection via URL regex (handles `account-string.region.console.aws.amazon.com` format)
  - Navbar background color customization
  - Region flag display next to region selector
  - Account information display (mapped by account ID)
  - Service-specific favicon updates
- Retry mechanism (3 attempts) for region selector detection
- Debug logging with `isDebug` flag

### 3. Popup Interface (popup.html, popup.js, css/popup.css)
- Settings management interface
- Features:
  - Toggle switches with auto-save functionality
  - Account information entry management (add/remove)
  - Account ID validation (prevents empty entries)
  - Dark/Light theme switcher
  - Version display from manifest
- Responsive design with theme support

### 4. Background Script (background.js)
- Minimal initialization on extension install
- Storage sync initialization

### 5. Configuration Storage
- `chrome.storage.local.config`: Feature settings and account mappings
- `localStorage.theme`: Theme preference (dark/light)
- Config structure:
```javascript
{
  "background": "enabled" | "disabled",
  "flag": "enabled" | "disabled",
  "favicon": "enabled" | "disabled",
  "info": { "account_id": "label", ... }
}
```

### 6. Static Resources
- `flags/`: Country flag images (23 countries)
- `svgs/`: AWS service icons for favicons (200+ services)
- `icons/`: UI icons (theme toggle, save, etc.)

## Features

### Region Visualization
- Each AWS region has a unique color gradient
- Region flags are displayed next to the region selector
- Supports all AWS regions with specific color schemes
- Automatic region detection and display
- Supports both standard URLs (region.console.aws.amazon.com) and account-specific URLs (account-string.region.console.aws.amazon.com)

### Account Management
- Displays custom account information
- Account ID detection and mapping
- JSON-based configuration with default values
- Real-time validation
- Fallback to default account info when not configured

### Service Integration
- Dynamic favicon updates based on current AWS service
- Support for all major AWS services
- Special handling for composite services (e.g., CodeSuite)
- Automatic service detection

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
- Minimal storage footprint
- Automatic data validation

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
- Input validation for JSON data

### User Experience
- Instant settings application
- Auto-save functionality
- Visual feedback for actions
- Smooth transitions
- Responsive interface

### Error Handling
- JSON validation for account info
- Region selector retry mechanism
- Graceful fallbacks
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
