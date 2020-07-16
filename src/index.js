const Plugin = require('./Plugin.js');

const loader = require.resolve('./loader.js');
const howlerLoader = require.resolve('./howlerLoader.js');

module.exports = {
  Plugin,
  loader,
  howlerLoader,
};
