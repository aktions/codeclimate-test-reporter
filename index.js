const core = require('@actions/core');
const codeclimate = require('./codeclimate');

async function run() {
  
  const options = {
    id: core.getInput('codeclimate-test-reporter-id'),
    url: core.getInput('codeclimate-test-reporter-url'),
    version: core.getInput('codeclimate-test-reporter-version') || 'latest'
  };

  if (options.id) {
    core.exportVariable('CC_TEST_REPORTER_ID', options.id);
  }

  try {
    await codeclimate.download(options);
    await codeclimate.command(options, core.getInput('command'));
  } catch (err) {
    core.setFailed(err.message);
  }
}

run()