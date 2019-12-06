const exec = require('@actions/exec');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const os = require('os');
const path = require('path');

const binDir = path.join(__dirname, 'bin');
const bin = 'cc-test-reporter';

module.exports.download = async function (options = {}) {

  let binPath = path.join(binDir, bin);

  options.version = options.version || 'latest';

  const cachedBin = tc.find(bin, options.version);
  if (cachedBin) {
    binPath = cachedBin;
  } else {
    const url = getUrl(options);
    const tmpPath = await tc.downloadTool(url);
    core.debug(`downloaded to ${tmpPath}`)

    await io.mkdirP(binDir);
    await io.mv(tmpPath, binPath);
    await exec.exec(`chmod +x ${binPath}`);

    await tc.cacheDir(binDir, bin, options.version);
  }

  try {
    core.debug(`adding to PATH`);
    core.addPath(binDir);
  } catch (err) {
    core.setFailed(err.message);
  }

  return binPath;
}

function getUrl(options) {
  let url = options.url;
  if (!url) {
    url = `https://codeclimate.com/downloads/test-reporter/test-reporter-${options.version}-${os.platform()}-amd64`;
  }
  return url;
}

module.exports.command = async function (...args) {

  let stdout = '';
  let stderr = '';

  try {
    const options = {
      listeners: {
        stdout: (data) => { stdout += data.toString() },
        stderr: (data) => { stderr += data.toString() }
      }
    };
    await exec.exec(bin, args, options);
  } catch (err) {
    throw new Error(`${err}: ${stderr}`);
  }

  return stdout;
}

