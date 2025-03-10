# Architecture

AWS Colorful Navbar is a browser extension that enhances the AWS Console navigation experience by providing visual cues for different regions and services.

## Core Components

### 1. Manifest (manifest.json)
- Defines extension metadata, permissions, and resource access
- Specifies content scripts and web accessible resources
- Supports Manifest V3 specification

### 2. Main Script (main.js)
- Handles the core functionality of the extension
- Features:
  - Region-based navigation bar color customization
  - Region flag display next to region selector
  - Account information display
  - Service-specific favicon updates
- Implements retry mechanism for region selector
- Supports dark/light theme adaptation

### 3. Popup Interface (popup.html, popup.js, popup.css)
- Settings management interface
- Features:
  - Toggle switches with auto-save functionality
  - Account information JSON editor
  - Dark/Light theme switcher
  - Real-time theme preview
- Uses Font Awesome icons
- Responsive and accessible design

### 4. Configuration
- Stored in chrome.storage.local
- Theme preference in localStorage
- Configurable features:
  - Background color gradients
  - Region flags
  - Account information
  - Favicon customization
  - Theme preference

### 5. Resources
- Flags: Country/region specific flag images
- Service Icons: AWS service specific SVG icons
- Styles: Custom CSS with theme support

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

### Build Process
- Source code organization
- Resource management
- Version control
- Release packaging

### Testing
- Manual testing procedures
- Cross-browser compatibility
- Theme testing
- Region detection verification

### Maintenance
- Code documentation
- Version history
- Issue tracking
- Update procedures
