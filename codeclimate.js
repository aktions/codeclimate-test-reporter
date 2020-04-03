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
        err ? reject(err) : resolve(0);
      });
    });

    toolPath = await tc.cacheDir(path.dirname(toolPath), tool, options.version);
  }

  core.addPath(toolPath);
};

function getUrl(options) {
  if (options.url) {
    return options.url;
  }
  return `https://codeclimate.com/downloads/test-reporter/test-reporter-${options.version}-${os.platform()}-amd64`;
}

/**
 * The following code has been copied from github.com/paambaati/codeclimate-action 
 * and is copyrighted by GP under the terms of the MIT license.
 *
 * See: 
 * https://github.com/paambaati/codeclimate-action/blob/master/LICENSE
 * https://github.com/paambaati/codeclimate-action/blob/master/src/main.ts#L42-L59
 */
function getEnv() {
  const env = process.env;
  if (process.env.GITHUB_SHA !== undefined) {
    env.GIT_COMMIT_SHA = process.env.GITHUB_SHA;
  }
  if (process.env.GITHUB_REF !== undefined) {
    env.GIT_BRANCH = process.env.GITHUB_REF;
  }
  if (env.GIT_BRANCH)
    env.GIT_BRANCH = env.GIT_BRANCH.replace(/^refs\/heads\//, '');

  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    env.GIT_BRANCH = process.env.GITHUB_HEAD_REF || env.GIT_BRANCH;
    env.GIT_COMMIT_SHA = context.payload.pull_request?.['head']?.['sha'];
  }
  return env;
}

module.exports.command = async function (args) {
  return await new Promise((resolve, reject) => {
    exec(`${tool} ${args}`, { env: getEnv() }, (err) => {
      err ? reject(err) : resolve(0);
    });
  });
};

module.exports.find = function (version) {
  return tc.find(tool, version);
};
