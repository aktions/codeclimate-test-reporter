import * as core from '@actions/core';
import codeclimate, { Options } from './codeclimate';

async function run() {
  const options: Options = {
    id: core.getInput('codeclimate-test-reporter-id'),
    url: core.getInput('codeclimate-test-reporter-url'),
    version: core.getInput('codeclimate-test-reporter-version') || 'latest'
  };

  if (options.id) {
    core.exportVariable('CC_TEST_REPORTER_ID', options.id);
  }

  try {
    await codeclimate.download(options);
    await codeclimate.command(core.getInput('command'));
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(err.message);
  }
}

run()
