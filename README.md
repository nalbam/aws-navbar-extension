# AWS Colorful Navbar

> Change navbar color and flag according to AWS region

[![build](https://img.shields.io/github/actions/workflow/status/nalbam/aws-navbar-extension/push.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/nalbam/aws-navbar-extension/actions/workflows/push.yml)
[![release](https://img.shields.io/github/v/release/nalbam/aws-navbar-extension?style=for-the-badge&logo=github)](https://github.com/nalbam/aws-navbar-extension/releases)

## Features

* Region-based navigation bar color customization
* Region flag display next to region selector
* Service-specific favicon updates
* Account information display
* Support for all AWS global regions
* Multi-language support (ko, jp)

## Installation

* [Chrome Web Store](https://chrome.google.com/webstore/detail/aws-colorful-navbar/kgifmgnlchjjippdpkblbdlfidcpceme)
* [Microsoft Edge](https://chrome.google.com/webstore/detail/aws-colorful-navbar/kgifmgnlchjjippdpkblbdlfidcpceme)
* [Mozilla Firefox](https://addons.mozilla.org/firefox/addon/aws-colorful-navbar/)

## For Developers

* Open the Extension Management page by navigating to `chrome://extensions`
* Enable `Developer Mode` by clicking the toggle switch
* Click the `LOAD UNPACKED` button and select the extension directory

## Configuration

The extension supports the following configuration options:

* `background`: Enable/disable navbar color customization
* `flag`: Enable/disable region flag display
* `favicon`: Enable/disable service-specific favicon
* `info`: Custom account information display

## Supported Regions

See [flags/README.md](flags/README.md) for a complete list of supported regions and their corresponding flags.

## Screenshots

![aws navbar](images/screenshot.png)

![before](images/aws-navbar-extension-00.png)

![after](images/aws-navbar-extension-01.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
