import  * as core  from  '@actions/core';
import  * as tc  from  '@actions/tool-cache';
import  * as io  from  '@actions/io';
import  * as github  from  '@actions/github';
import  * as githubDefs from '@octokit/webhooks-definitions/schema';
import  * as os  from  'os';
import  * as path  from  'path';
import  { exec }  from  'child_process';

const tool = 'cc-test-reporter';

export interface Options {
  id?: string;
  version?: string;
  url?: string;
}

const download = async function (options:Options = {}) {

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

function getUrl(options: Options) {
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
  // clone object otherwise this whole function is pointlessly modifying the original
  // due to it being a reference.
  const env = {...process.env};
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
    env.GIT_COMMIT_SHA = (github.context.payload as githubDefs.PullRequestEvent).pull_request['head']['sha'];
  }
  return env;
}

const command = async function (args:any) {
  return await new Promise((resolve, reject) => {
    exec(`${tool} ${args}`, { env: getEnv() }, (err) => {
      err ? reject(err) : resolve(0);
    });
  });
};

const find = function (version: string) {
  return tc.find(tool, version);
};

export default {
  download,
  command,
  find,
  getUrl,
  getEnv,
}
