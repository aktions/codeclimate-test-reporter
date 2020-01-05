const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const tool = 'cc-test-reporter';

module.exports.download = async function (options = {}) {

  options.version = options.version || 'latest';

  let toolPath = tc.find(tool, options.version);
  if (!toolPath) {
    const url = getUrl(options);
    const downloadPath = await tc.downloadTool(url);
    toolPath = path.join(path.dirname(downloadPath), tool);
    await io.mv(downloadPath, toolPath);
    await new Promise((resolve, reject) => {
      exec(`chmod +x ${toolPath}`, {}, (err) => {
        err ? reject(1) : resolve(0);
      })
    });

    toolPath = await tc.cacheDir(path.dirname(toolPath), tool, options.version);
  }

  core.addPath(toolPath);
}

function getUrl(options) {
  if (options.url) {
    return options.url;
  }
  return `https://codeclimate.com/downloads/test-reporter/test-reporter-${options.version}-${os.platform()}-amd64`;
}

module.exports.command = async function (args) {
  return await new Promise((resolve, reject) => {
    exec(`${tool} ${args}`, { env: process.env }, (err) => {
      err ? reject(1) : resolve(0);
    })
  });
}

module.exports.find = function (version) {
  return tc.find(tool, version);
}
