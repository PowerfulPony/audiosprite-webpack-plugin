const Plugin = require('./Plugin.js');

const loader = require.resolve('./loader.js');
const emptyHowlerLoader = require.resolve('./emptyHowlerLoader.js');

module.exports = {
  Plugin,
  loader,
  emptyHowlerLoader,
};
