const chalk = require("chalk");
const Configstore = require("configstore");
const pkg = require("./../package.json");
const conf = new Configstore(pkg.name);

function saveConfig(config) {
  conf.set("browserPath", config.browserPath);
  conf.set("url", config.url);
  conf.set("projectName", config.projectName);
  console.log(chalk.grey("Configuration saved"));
}

async function getAllConfigAsync() {
  return await conf.all();
}
function get(key) {
  return conf.get(key);
}

module.exports = {
  saveConfig,
  getAllConfigAsync,
  get,
};
