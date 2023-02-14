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
import { TypedFunction } from "alsatian/dist/core/spying/spied-function.i";

const runnerDir = path.join(__dirname, '..', 'runner');
const tempDir = path.join(runnerDir, 'temp');
const cacheDir = path.join(runnerDir, 'cache');

import codeclimate from './codeclimate';

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
    Expect(code).toBe(0);
  }

  @Test('failing command execution')
  public async testCommandFail(){
    try {
      await codeclimate.command('whatever');
    } catch (err) {
      Expect((err as Error).message).toContain('Command failed: cc-test-reporter whatever');
    }
  }

  @Test('successful command with glob argument execution')
  public async testCommandGlob() {
    const output = `${tempDir}/combined.json`;
    const code = await codeclimate.command(`sum-coverage -p 2 -o ${output} fixtures/codeclimate.*.json`);
    Expect(code).toBe(0);
    Expect(fs.existsSync(output)).toBeTruthy();  
  }
}
