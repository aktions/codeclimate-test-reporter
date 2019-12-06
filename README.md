# Code Climate Test Reporter Action

## Usage

Basic usage is as follows: 

```yaml
- name: Code Climate Test Reporter
  uses: aktions/codeclimate-test-reporter@v1
  with:
    codeclimate-test-reporter-id: ${{ secrets.CC_TEST_REPORTER_ID }}
    command: after-build
```

The action can be configured with the following inputs:

- `codeclimate-test-reporter-id`: **Required**. The test reporter ID. This is a write-only ID that can only post test reports.
- `codeclimate-test-reporter-version`: **Optional**. The test reporter version. Default is "latest".
- `codeclimate-test-reporter-url`: **Optional**. The test reporter download URL. If supplied, it will override the version input.
- `command`: **Optional**. The command to execute using the code climate test reporter. Default is "after-build".


You can also supply additional command line arguments via the same `command` 
input.

    - name: Send code coverage report
      uses: aktions/codeclimate-test-reporter@v1
      with:
        ...
        command: after-build --coverage-input-type gocov