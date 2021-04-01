# SAP TimeSheet CLI Tool

A CLI tool to fill SAP s4hana timesheet.

## Install

`npm install -g sap-timesheet`

or

`yarn global add sap-timesheet`

## Usage

`sap-timesheet init` to initialize/configure

`sap-timesheet -m "your message"`

**All Arguments**

```
Options:
      --help     Show help                                              [boolean]
      --version  Show version number                                    [boolean]
  -m, --message  Message                                      [string] [required]
  -h, --hours    Number of Hours to fill upto                        [default: 8]
  -d, --date     Date (dd-MM-yy)               [string] [default: <today's date>]
  -p, --project  Project Name                 [string] [default: <set from init>]
```

Example using all arguments:

    sap-timesheet -m "youMessage" -h 2 -d "30-12-21" -p "unique substring of project name"

## How it works

We use [Puppeteer](https://github.com/puppeteer/puppeteer) to run a browser and simulate all required actions using javascript.
