#!/bin/bash

OS_NAME="$(uname | awk '{print tolower($0)}')"

SHELL_DIR=$(dirname $0)

RUN_PATH=${SHELL_DIR}

REPOSITORY=${GITHUB_REPOSITORY}

USERNAME=${GITHUB_ACTOR}
REPONAME=$(echo "${REPOSITORY}" | cut -d'/' -f2)

################################################################################

# command -v tput > /dev/null && TPUT=true
TPUT=

_echo() {
  if [ "${TPUT}" != "" ] && [ "$2" != "" ]; then
    echo -e "$(tput setaf $2)$1$(tput sgr0)"
  else
    echo -e "$1"
  fi
}

_result() {
  echo
  _echo "# $@" 4
}

_command() {
  echo
  _echo "$ $@" 3
}

_success() {
  echo
  _echo "+ $@" 2
  exit 0
}

_error() {
  echo
  _echo "- $@" 1
  exit 1
}

_replace() {
  if [ "${OS_NAME}" == "darwin" ]; then
    sed -i "" -e "$1" $2
  else
    sed -i -e "$1" $2
  fi
}

_prepare() {
  # chmod 755
  find ./** | grep [.]sh | xargs chmod 755

  # mkdir target
  mkdir -p ${RUN_PATH}/target
  mkdir -p ${RUN_PATH}/release
}

################################################################################

_package() {
  VERSION=$(cat ./manifest.json | jq '.version' -r)

  echo $VERSION >./target/VERSION

  ITEMS="manifest.json icon.png main.js background.js popup.html popup.js css flags images js svcs"

  # mv3
  zip -r ${RUN_PATH}/release/$REPONAME-$VERSION.zip $ITEMS

  # mv2
  cat ./manifest-v2.json | jq '.version = $VERSION' --arg VERSION $VERSION >./manifest.json
  zip -r ${RUN_PATH}/release/$REPONAME-$VERSION-mv2.zip $ITEMS
}

################################################################################

_prepare

_package

_success
