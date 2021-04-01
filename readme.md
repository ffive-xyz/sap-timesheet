# SAP TimeSheet CLI Tool

A CLI tool to fill SAP s4hana timesheet.

## Install

`npm install -g sap-timesheet`

or

`yarn global add sap-timesheet`
## Usage

`sap-timesheet init`

`sap-timesheet -m "your message"`

You can see all arguments by:
`sap-timesheet`

## How it works

We use [Puppeteer](https://github.com/puppeteer/puppeteer) to run a browser and simulate all required actions using javascript.
