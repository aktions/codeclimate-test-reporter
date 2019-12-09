const path = require('path');
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
  await codeclimate.download({ version: '0.6.3' });
  expect(codeclimate.find('0.6.3')).toBeTruthy(); // latest won't hit the cache.
});

test('execute a command using the reporter', async () => {
  const code = await codeclimate.command('env', '-f', 'json');
  expect(code).toBe(0);
});