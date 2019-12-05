const path = require('path');
const os = require('os');
const fs = require('fs');
const io = require('@actions/io');

const tempDir = path.join(__dirname, 'runner', 'temp');
const cacheDir = path.join(__dirname, 'runner', 'cache');

process.env['RUNNER_TEMP'] = tempDir;
process.env['RUNNER_TOOL_CACHE'] = cacheDir;

afterAll(() => {
  io.rmRF(tempDir);
  io.rmRF(cacheDir);
});

const codeclimate = require('./codeclimate');

test('download, install and cache the reporter', async () => {
  const toolPath = await codeclimate.download({ version: 'latest' });
  expect(toolPath).toBe(path.join(__dirname, 'bin', 'cc-test-reporter'));
});

test('cache directory should contain the reporter', async () => {
  const cachePath = path.join(cacheDir, 'cc-test-reporter', 'latest', os.arch(), 'cc-test-reporter');
  expect(fs.existsSync(cachePath)).toBeTruthy();
});

test('execute a command using the reporter', async () => {
  const out = await codeclimate.command('env', '-f', 'json');
  const obj = JSON.parse(out);
  expect(obj).toBeObject();
  expect(obj).toContainKeys([
    'branch',
    'build_identifier',
    'build_url',
    'commit_sha',
    'committed_at',
    'name'
  ]);
});