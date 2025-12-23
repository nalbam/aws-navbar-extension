# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-12-23

### Added
- Custom color themes per region with color picker UI
- Gradient preview in popup
- 2-4 color gradient support for each region
- Reset to default functionality per region
- Live color update (Apply button instantly updates navbar)
- Shared color data module (colors.js)
- Christmas season snow effect (Dec 20-26)
- Support for new AWS regions:
  - ap-east-2 (Taiwan - Taipei)
  - ap-southeast-5 (Malaysia - Kuala Lumpur)
  - ap-southeast-6 (New Zealand - Auckland)
  - ap-southeast-7 (Thailand - Bangkok)
  - ca-west-1 (Canada - Calgary)
  - mx-central-1 (Mexico - Queretaro)

### Removed
- Favicon feature (service-specific favicons)
- Account Info feature (account information display)
- `svgs/` directory (200+ service icons)

### Changed
- Simplified popup UI focused on color customization
- Reduced extension size significantly
- Updated config structure with `customColors` support

## [1.10.0] - 2025-12-23

### Changed
- Enhanced AWS Console URL region detection
- Improved support for account-specific URLs (`account-string.region.console.aws.amazon.com`)

## [1.9.1] - 2025-03-08

### Added
- Version display in popup with dynamic version retrieval from manifest

### Changed
- Account ID validation improvements
- Prevent empty account entries

## [1.9.0] - 2025-03-08

### Added
- Account Info UI 개선:
  - Account ID와 Name을 위한 전용 입력 필드
  - 계정 추가/삭제 버튼
  - 기본값 (123456789012: PROD) 자동 설정

### Changed
- Account Info 관리 방식 변경:
  - JSON 텍스트 입력에서 전용 UI로 변경
  - 직관적인 계정 정보 입력 방식
  - 실시간 유효성 검사

### Fixed
- Account Info 입력 오류 방지
- JSON 유효성 검사 개선

## [1.8.6] - 2025-03-08

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
- Added default account info when not configured

## Features (v2.0)

### Region Visualization
- Custom color gradients for each AWS region (35+ regions supported)
- User-customizable gradient colors (2-4 colors)
- Region flags display (29 countries)
- Support for all AWS global regions
- Automatic region detection

### Color Customization
- Per-region color picker UI
- Real-time gradient preview
- Reset to default per region
- Persistent custom color settings

### Theme System
- Dark/Light mode toggle
- Theme persistence
- Smooth transitions
- AWS-inspired colors

### Internationalization
- Multi-language support (ko, jp)
- Region name translations
- Global region handling
