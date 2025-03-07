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

### 3. Configuration
- Stored in chrome.storage.local
- Configurable features:
  - Background color gradients
  - Region flags
  - Account information
  - Favicon customization

### 4. Resources
- Flags: Country/region specific flag images
- Service Icons: AWS service specific SVG icons
- Styles: Materialize CSS for popup styling

## Features

### Region Visualization
- Each AWS region has a unique color gradient
- Region flags are displayed next to the region selector
- Supports all AWS regions with specific color schemes

### Account Management
- Displays custom account information
- Account ID detection and mapping

### Service Integration
- Dynamic favicon updates based on current AWS service
- Support for all major AWS services
- Special handling for composite services (e.g., CodeSuite)

### Internationalization
- Support for multiple languages (ko, jp)
- Region name translations

## Technical Details

### Storage
- Uses chrome.storage.local for configuration persistence
- Minimal storage footprint

### Security
- Minimal permissions required:
  - activeTab: For current tab manipulation
  - storage: For configuration storage
- Host permissions limited to AWS Console domains

### Performance
- Lightweight implementation
- Asynchronous storage operations
- Efficient resource loading
