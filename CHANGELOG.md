# Changelog

All notable changes to this project will be documented in this file.

## [1.7.3] - 2025-03-08

### Added
- Dark/Light theme support with persistent settings
- Auto-save functionality for toggle switches
- Retry mechanism for region selector (3 attempts)
- Support for new AWS regions:
  - ap-south-2 (Hyderabad)
  - ap-southeast-4 (Melbourne)
  - eu-south-3 (Milan)
  - eu-central-3 (Zurich)
  - me-west-1 (UAE West)
  - il-central-1 (Israel)

### Changed
- Updated popup interface with modern design
- Improved settings management
- Enhanced accessibility features
- Optimized performance with async operations

### Fixed
- Region selector detection reliability
- Account ID detection improvements
- Resource loading optimizations
- JSON validation handling

## Features Evolution

### Region Visualization
- Custom color gradients for each AWS region
- Region flags display
- Support for all AWS global regions
- Automatic region detection

### Account Management
- Account information display
- Account ID detection and mapping
- Custom account labels
- JSON configuration

### Service Integration
- Dynamic favicon updates
- Support for AWS service icons
- Special handling for composite services
- Automatic service detection

### Theme System
- Dark/Light mode toggle
- Theme persistence
- Smooth transitions
- AWS-inspired colors

### Internationalization
- Multi-language support (ko, jp)
- Region name translations
- Global region handling
