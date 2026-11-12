#!/bin/bash
# Build the release packages from the working tree:
#   release/aws-navbar-extension-<VERSION>.zip      Manifest V3 (Chrome, Edge)
#   release/aws-navbar-extension-<VERSION>-mv2.zip  Manifest V2 (Firefox)
# The package version comes from VERSION. The working tree is not changed.
# Requires: jq, zip.
set -euo pipefail

cd "$(dirname "$0")"
ROOT="$(pwd)"

NAME="aws-navbar-extension"
VERSION="$(cat VERSION)"

# Files and directories that the extension uses. Each package gets its own
# manifest.json. flags/README.md is documentation and is not packaged.
ITEMS="icon.png colors.js utils.js main.js popup.html popup.js css flags icons"
EXCLUDE="flags/README.md"

mkdir -p target release
# Staging directories for the packages, removed on success and on failure.
WORK="$(mktemp -d)"
trap 'rm -rf "${WORK}"' EXIT
# The release step reads the version from target/VERSION.
echo "${VERSION}" > target/VERSION

# package <manifest> <zip file>
package() {
  local stage="${WORK}/$(basename "$2" .zip)"
  mkdir "${stage}"
  # shellcheck disable=SC2086 # ITEMS is a word list
  cp -R ${ITEMS} "${stage}/"
  rm "${stage}/${EXCLUDE}"
  jq --arg version "${VERSION}" '.version = $version' "$1" > "${stage}/manifest.json"
  rm -f "$2"
  (cd "${stage}" && zip -qr "${ROOT}/$2" .)
  echo "+ $2"
}

package manifest.json "release/${NAME}-${VERSION}.zip"
package manifest-v2.json "release/${NAME}-${VERSION}-mv2.zip"
