# Code Climate Test Reporter Action

Action for sending reports to Code Climate.
Originated from https://github.com/aktions/codeclimate-test-reporter
I made a fork of this project as it has grown quiet for a while and this is my favorite implementation of the action.
Also there was some changes I wanted to do around the code base (not functionality.)
If any kudos are to be given make sure the originator is above my name.  ;-)

## Usage

Basic usage is as follows: 

```yaml
- name: Code Climate Test Reporter
  uses: BadOPCode/codeclimate-test-reporter@v2
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
      uses: BadOPCode/codeclimate-test-reporter@v2
      with:
        ...
        command: after-build --coverage-input-type gocov