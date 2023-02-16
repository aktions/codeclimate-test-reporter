import {
  createFunctionSpy,
  Expect,
  ISpiedFunction,
  SetupFixture,
  SpyOn,
  Teardown,
  TeardownFixture,
  Test,
  TestCase,
  TestFixture
} from "alsatian";
import proxyquire from 'proxyquire';
import * as path from 'path';
import * as io from '@actions/io';
import * as fs from 'fs';
import * as os from 'os';
import * as cp from 'child_process';
import {Contains} from "ts-nodash";

const runnerDir = path.join(__dirname, '..', 'runner');
const tempDir = path.join(runnerDir, 'temp');
const cacheDir = path.join(runnerDir, 'cache');

const githubStub: {[key:string]:any} = {};
const execSpy = createFunctionSpy();

// import codeclimate from './codeclimate';
const codeclimate = proxyquire.callThru().load('./codeclimate', {
  "@actions/github": githubStub,
  "child_process": {
    exec: (...args:[string, ()=>void]) => {
      execSpy(...args);
      cp.exec(...args);
    },
  }
}).default;

@TestFixture("CodeClimate Reporter Test Suite")
export class CCReporterTestSuite {

  @SetupFixture
  public async setupTestEnvironment() {
    process.env['RUNNER_TEMP'] = tempDir;
    process.env['RUNNER_TOOL_CACHE'] = cacheDir;
    await codeclimate.download({ version: '0.6.3' });
  }

  @TeardownFixture
  public afterAll() {
    io.rmRF(runnerDir);
  }

  @Test('download, install and cache the reporter')
  public async testDownload() {
    Expect(codeclimate.find('0.6.3')).toBeTruthy(); // latest won't hit the cache.  
  }

  @Test('successful command execution')
  public async testCommandSuccess() {
    const code = await codeclimate.command('env -f json');
    Expect(execSpy).toHaveBeenCalled();
    Expect(code).toBe(0);
  }

  @Test('failing command execution')
  public async testCommandFail(){
    try {
      await codeclimate.command('whatever');
    } catch (err) {
      Expect(execSpy).toHaveBeenCalled();
      Expect((err as Error).message).toContain('Command failed: cc-test-reporter whatever');
    }
  }

  @Test('successful command with glob argument execution')
  public async testCommandGlob() {
    const output = `${tempDir}/combined.json`;
    const code = await codeclimate.command(`sum-coverage -p 2 -o ${output} fixtures/codeclimate.*.json`);
    Expect(execSpy).toHaveBeenCalled();
    Expect(code).toBe(0);
    Expect(fs.existsSync(output)).toBeTruthy();  
  }

  @Test('getUrl conditions')
  public testGetUrlConditions() {
    let result = codeclimate.getUrl({version: "1.2.3"});
    Expect(result).toBe(`https://codeclimate.com/downloads/test-reporter/test-reporter-1.2.3-${os.platform()}-amd64`)
    result = codeclimate.getUrl({url: "http://helloworld.com/test-package"});
    Expect(result).toBe("http://helloworld.com/test-package");
  }

  @Test('getEnv overwrite conditions')
  public testGetEnvOverwriteConditions() {
    process.env['GITHUB_SHA'] = "DEADBEEF";
    process.env['GITHUB_REF'] = "refs/heads/test";
    process.env['GITHUB_HEAD_REF'] = "test-ref"
    process.env['GITHUB_EVENT_NAME'] = "pull_request";
    githubStub['context'] = {
      payload: {
        pull_request: {
          head: {
            sha: "abc123"
          }  
        }
      }
    }
    let result = codeclimate.getEnv();
    Expect(Contains(result, {
      "GITHUB_SHA": "DEADBEEF",
      "GITHUB_REF": "refs/heads/test",
      "GITHUB_HEAD_REF": "test-ref",
      "GITHUB_EVENT_NAME": "pull_request",
      "GIT_COMMIT_SHA": "abc123",
      "GIT_BRANCH": "test-ref",
    })).toBe(true);
  }
}
