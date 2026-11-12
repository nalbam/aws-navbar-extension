# Changelog

All notable changes to this project will be documented in this file.

## [2.3.2] - 2026-11-13

Permission and package cleanup after the Chrome Web Store review, and popup accessibility fixes.

### Removed
- Host permission `*://*.console.aws.amazon.com/*` from `manifest.json` (`host_permissions`) and `manifest-v2.json` (`permissions`). A content script declared in the manifest does not need a host permission, and the extension sends no network requests. The content script `matches` still give access to AWS Console pages, so the browser shows the same site access as before.
- `icons/*.ico` from `web_accessible_resources` (only the popup uses the icons), and the unused `icons/sun-hover.ico` and `icons/moon-hover.ico`.
- `background.js`. No manifest declared it, so it never ran.
- Region codes `eu-central-3`, `eu-south-3` and `me-west-1` from the region selector. They are not AWS regions. Custom colors saved for them are ignored.
- `flags/README.md` from the packages.

### Fixed
- Popup region selector: Enter and Space select the option that the arrow keys point to. Before, the keyboard could not select a region.
- Popup results: a status message shows applied, reset and error results, also to screen readers. An invalid hex value blocks Apply instead of saving the last valid color.
- Popup focus indicators and button text contrast (4.5:1 or more in both themes).
- During the snow season (Dec 20-26), a sticky or fixed navbar keeps its position.
- Homepage region selector: keyboard selection, and a saved region that no longer exists counts as Auto.
- Privacy policy: storage of the popup theme and the navbar style, and site access.

### Changed
- `package.sh` builds the packages in a temporary directory and stops on the first error. The repository manifests are no longer changed by a build.
- The release workflow runs all repository checks (`node --test`) before it packages the extension.

## [2.3.1] - 2026-11-12

### Removed
- `activeTab` permission from `manifest.json` and `manifest-v2.json` (not required; the extension uses host permissions and content scripts)

## [2.3.0] - 2026-11-12

Support for the new AWS Console design. The new navbar has a light background and dark text, so the previous region gradients made the navbar text and icons hard to read.

### Added
- Navbar styles: `vivid` (default, flag colors with white text) and `subtle` (pastel flag colors with dark text and a 4px band of the pure flag colors). New config key `style`.
- Readable navbar text: every gradient color has a contrast ratio of at least 4.5:1 with the text color (WCAG 2.x AA). Colors that are too light or too dark for the style are adjusted.
- Popup: style selector, navbar preview with the readable colors, and a note when colors are adjusted
- Flags in the region menu
- Unit tests (`node --test`) and a test workflow for pull requests

### Changed
- The content script sets the navbar text and icon colors. Menus, the search field and the AWS account color label keep the AWS colors.
- The content script re-applies the theme when AWS re-renders the navbar, when the page title changes and when the window is resized, instead of a single attempt with 3 retries
- Global services are detected from the page title suffix `| Global`, which the console does not translate (checked in the Korean console). The Korean/Japanese region name table is removed; the Japanese entry used `jp` instead of the `lang` value `ja` and did not work.
- The region flag is decorative (`alt=""`, `aria-hidden`), so screen readers do not read an English country name inside the region button
- The homepage header uses the same readable theme
- Screenshots updated for the new console design

### Removed
- `getDefaultGradient()` and object input for `buildGradient()`; use `getRegionColors()` and `getNavbarTheme()`
- Emoji fallback for flag images (flags are bundled with the extension)

## [2.2.0] - 2025-12-24

### Added
- Custom dropdown for region selection with improved accessibility
- Dynamic color gradients preview in region selector dropdown

### Changed
- Refactored code structure for improved readability and maintainability
- Adjusted popup body max-height for improved layout consistency

## [2.1.1] - 2025-12-24

### Fixed
- Firefox MV2 manifest: removed `host_permissions` (MV3 only), added to `permissions`
- Firefox MV2 manifest: added `browser_specific_settings.gecko` with id and data_collection_permissions
- package.sh: added `utils.js` to package items
- package.sh: fixed manifest.json being overwritten after MV2 packaging (now backs up and restores)

## [2.1.0] - 2025-12-24

### Added
- Live toggle updates: Background and Flag settings apply instantly without page refresh
- Debounce utility function for performance optimization
- DOM element caching to reduce repeated querySelector calls
- Accessible UI with ARIA labels, roles, and visually-hidden helper class
- Flag image error handling with emoji fallback

### Changed
- Snowfall animation improved for more natural effect:
  - Added gentle left/right sway motion
  - Smooth fade-in and fade-out transitions
  - Slower animation speed (4-8 seconds)
- Color preview updates now debounced (50ms delay)
- Region dropdown uses DocumentFragment for single DOM update
- Snowflakes use DocumentFragment and batched cssText for better performance
- Pre-compiled regex patterns to avoid recompilation on each call
- Config caching with storage change listener invalidation

### Fixed
- Duplicate flag insertion prevented with removeRegionFlag() call
- Storage type consistency (all using chrome.storage.local)

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
- Custom color gradients for each AWS region (38 regions)
- User-customizable gradient colors (2-4 colors)
- Region flags display (29 countries)
- Support for all AWS global regions
- Automatic region detection
- Christmas season snow effect (Dec 20-26)

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
