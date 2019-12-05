const exec = require('@actions/exec');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const os = require('os');
const path = require('path');

const binDir = path.join(__dirname, 'bin');
const bin = 'cc-test-reporter';

async function download(options = {}) {

  let toolPath = path.join(binDir, bin);

  const cachedTool = tc.find(bin, options.version);
  if (cachedTool) {
    toolPath = cachedTool;
  } else {
    const url = getUrl(options);
    const tmpPath = await tc.downloadTool(url);
    core.debug(`downloaded to ${tmpPath}`)

    await io.mkdirP(binDir);
    await io.mv(tmpPath, toolPath);
    await exec.exec(`chmod +x ${toolPath}`);

    await tc.cacheDir(binDir, bin, options.version);
  }

  try {
    core.debug(`adding to PATH`);
    core.addPath(binDir);
  } catch (err) {
    core.setFailed(err.message);
  }

  return toolPath;
}

function getUrl(options) {
  let url = options.url;
  if (!url) {
    url = `https://codeclimate.com/downloads/test-reporter/test-reporter-${options.version}-${os.platform()}-amd64`;
  }
  return url;
}

async function command(...args) {
  
  let toolPath = path.join(binDir, bin);

  let stdout = '';
  let stderr = '';
  
  try {
    const options = {
      listeners: {
        stdout: (data) => { stdout += data.toString() },
        stderr: (data) => { stderr += data.toString() }
      }
    };
    await exec.exec(toolPath, args, options);
  } catch (err) {
    throw new Error(`${err}: ${stderr}`);
  }

  return stdout;
}

module.exports = {
  download: download,
  command: command
};