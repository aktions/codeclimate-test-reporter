# Code Climate Test Reporter Action

## Usage

Basic usage is as follows: 

```yaml
- name: Code Climate Test Reporter
  uses: alexkappa/codeclimate-test-reporter@v0.0.1
  with:
    codeclimate-test-reporter-id: ${{ secrets.CC_TEST_REPORTER_ID }}
    command: after-build
```

The action can be configured with the following inputs:

- `codeclimate-test-reporter-id`: **Required**. The test reporter ID. This is a write-only ID that can only post test reports.
- `codeclimate-test-reporter-version`: **Optional**. The test reporter version. Default is "latest". 
- `codeclimate-test-reporter-os`: **Optional** The test reporter operating system. Default is "linux".
- `codeclimate-test-reporter-arch`: **Optional**. The test reporter architecture. Default is "amd64".
- `codeclimate-test-reporter-url`: **Optional**. The test reporter download URL. If supplied, it will override the version, os and architecture input.
- `command`: **Optional**. The command to execute using the code climate test reporter. Default is "after-build".


You can also supply additional command line arguments via the same `command` 
input.

    - name: Send code coverage report
      uses: alexkappa/codeclimate-test-reporter@v0.0.1
      with:
        ...
        command: after-build --coverage-input-type gocov