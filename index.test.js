const path = require('path');
const io = require('@actions/io');
const fs = require('fs')

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
  await codeclimate.download({ version: '0.6.3' });
  expect(codeclimate.find('0.6.3')).toBeTruthy(); // latest won't hit the cache.
});

test('successful command execution', async () => {
  const code = await codeclimate.command('env -f json');
  expect(code).toBe(0);
});

test('failing command execution', async () => {
  try {
    await codeclimate.command('whatever');
  } catch (err) {
    expect(err.message).toStartWith('Command failed: cc-test-reporter whatever');
  }
});

test('successful command with glob argument execution', async () => {
  const output = `${tempDir}/combined.json`;
  const code = await codeclimate.command(`sum-coverage -p 2 -o ${output} fixtures/codeclimate.*.json`);
  expect(code).toBe(0);
  expect(fs.existsSync(output)).toBeTruthy();
});
