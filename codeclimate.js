const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const os = require('os');
const path = require('path');

const tool = 'cc-test-reporter';

module.exports.download = async function (options = {}) {

  options.version = options.version || 'latest';

  let toolPath = tc.find(tool, options.version);
  if (!toolPath) {
    const url = getUrl(options);
    const downloadPath = await tc.downloadTool(url);
    toolPath = path.join(path.dirname(downloadPath), tool);
    await io.mv(downloadPath, toolPath);
    await exec.exec(`chmod +x ${toolPath}`);

    toolPath = await tc.cacheDir(path.dirname(toolPath), tool, options.version);
  }

  core.addPath(toolPath);
}

function getUrl(options) {
  let url = options.url;
  if (!url) {
    url = `https://codeclimate.com/downloads/test-reporter/test-reporter-${options.version}-${os.platform()}-amd64`;
  }
  return url;
}

module.exports.command = async function (...args) {
  return await exec.exec(tool, args, {env: process.env});
}

module.exports.find = function (version) {
  return tc.find(tool, version);
}