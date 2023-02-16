# Code Climate Test Reporter Action

Action for sending reports to Code Climate.
Originated from https://github.com/aktions/codeclimate-test-reporter
I made a fork of this project as it had grown quiet for a while and this is my favorite implementation of the Code Climate action.
The original (at the time of writing this) has stopped working because it's trying to use Node12 instead of Node16 which is required by GitHub now.
Normally, I would have just made a PR and called it a day.  But I was in a rush to fix my repos which had all stopped... AND the big one... I prefer Typescript and Alsatian unit testing. And that is why I forked.  I leave my fork references in my repo purely to give credit where credit is due.  If any kudos are to be given make sure the originator is above my name.  ;-)
That being said, this fork currently has no compatibilty at HEAD to make a PR to the original repo nor will it ever resync at this point.
Please be cautious when making a PR, not to make it to the original repo.
All PR's and suggestions are welcomed.


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
