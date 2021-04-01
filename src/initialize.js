const inquirer = require("inquirer");
const fs = require("fs");
const conf = require("./myConfigstore");

function askConfigQuestion() {
  return inquirer.prompt([
    {
      name: "browserPath",
      type: "input",
      message:
        "Enter browser path which is already logged in with sap: [Chromium based browser only]",
      default:
        conf.get("browserPath") ||
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      validate: function (value) {
        if (fs.existsSync(value)) {
          return true;
        }
        return "Path invalid";
      },
    },
    {
      name: "url",
      type: "input",
      message: "Enter s4hana url of timesheet: ",
      default: conf.get("url"),
      validate: function (value) {
        var res = value.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        if (res == null) return "Invalid url format";
        else return true;
      },
    },
    {
      name: "projectName",
      type: "input",
      message: "Default Project Name: ",
      default: conf.get("projectName"),
    },
  ]);
}

module.exports = {
  askConfigQuestion,
};
