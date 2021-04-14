#!/usr/bin/env node

const moment = require("moment");
const yargs = require("yargs");
const chalk = require("chalk");
const figlet = require("figlet");
const sapConfig = require("./initialize");
const conf = require("./myConfigstore");
const pkg = require("../package.json");

const markAttendance = require("./markAttendance");

console.log(
  chalk.blueBright(figlet.textSync(pkg.name, { horizontalLayout: "full" }))
);
const run = async () => {
  yargs.scriptName(pkg.name);

  // init
  yargs.command({
    command: ["init", "config"],
    describe: "Initialize/configure cli tool",
    handler: async (argv) => {
      const config = await sapConfig.askConfigQuestion();
      conf.saveConfig(config);
    },
  });

  // mark
  yargs.command({
    command: ["mark", "$0"],
    describe: "Marks attendance",
    builder: {
      m: {
        alias: "message",
        describe: "Message",
        type: "string",
        demandOption: true,
      },
      h: {
        alias: "hours",
        describe: "Number of Hours to fill upto",
        type: "int",
        demandOption: false,
        default: 8,
      },
      o: {
        alias: "offset",
        describe: "Number of Offset Hours",
        type: "int",
        demandOption: false,
        default: 0,
        hidden: true,
      },
      d: {
        alias: "date",
        describe: "Date (dd-MM-yy)",
        type: "string",
        demandOption: false,
        default: moment(new Date()).format("DD-MM-YY"),
      },
      p: {
        alias: "project",
        describe: "Project Name",
        type: "string",
        demandOption: false,
        default: conf.get("projectName"),
      },
    },
    handler: async (argv) => {
      let isValid = true;
      if (!conf.get("browserPath")) {
        isValid = false;
        console.log(chalk.red("Browser path not set. Run 'init' to configure"));
      }
      if (!argv.p) {
        isValid = false;
        console.log(
          chalk.red(
            "Project name not provided. Either use -p or run 'init' to configure"
          )
        );
      }
      if (!moment(argv.date, "DD-MM-YY", true).isValid()) {
        isValid = false;
        console.log(
          chalk.red("Invalid date format. Correct date format is DD-MM-YY")
        );
      }
      if (isValid) {
        await markAttendance.markAttendance(
          argv.message,
          argv.hours,
          argv.offset,
          moment(argv.date, "DD-MM-YY", true).toDate(),
          argv.p
        );
      }
    },
  });

  yargs.parse();
};

run();
