const core = require('@actions/core');
const codeclimate = require('./codeclimate');

async function run() {
  try {
    await codeclimate.download({
      url: core.getInput('codeclimate-test-reporter-url'),
      version: core.getInput('codeclimate-test-reporter-version') || 'latest'
    });
    await codeclimate.command(core.getInput('command').split(' '));
  }
  catch (err) {
    core.setFailed(err.message);
  }
}

run()