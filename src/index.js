const { loaderPath } = require('accumulator-webpack-plugin');
const Plugin = require('./Plugin');
const { packageName } = require('./consts');

module.exports = {
  Plugin,
  loaderPath,
  packageName,
};
