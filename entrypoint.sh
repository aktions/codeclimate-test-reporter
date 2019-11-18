#!/bin/sh -l

install() {
  version=${CC_TEST_REPORTER_VERSION:-"latest"}
  os=${CC_TEST_REPORTER_OS:-"linux"}
  arch=${CC_TEST_REPORTER_ARCH:-"amd64"}
  url=${CC_TEST_REPORTER_DOWNLOAD_URL:-"https://codeclimate.com/downloads/test-reporter/test-reporter-${version}-${os}-${arch}"}

  curl -o cc-test-reporter -sSL $url
  chmod +x cc-test-reporter
  mv cc-test-reporter /usr/local/bin
}

run() {
  cc-test-reporter $@
}

install
run $@
