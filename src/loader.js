const path = require('path');
const { getOptions } = require('loader-utils');
const { pluginName } = require('./consts.js');
const emptySound = require('./emptySound.js');

function audioSpriteWebpackPluginLoader() { // eslint-disable-line consistent-return
  const { emptySprite } = getOptions(this);
  if (emptySprite) return `module.exports = ${emptySound}`;

  const compete = this.async();

  const plugin = this[pluginName];

  const basePath = this.rootContext;
  const soundPath = this.resourcePath;
  const key = plugin.constructor.getKey(basePath, soundPath);

  const sharedModulePath = path.resolve(basePath, plugin.sharedModulePath);
  const howlerPath = require.resolve('howler-chaining');

  const promise = plugin.registerSound.call(plugin, soundPath);

  promise.then(() => {
    compete(null, `
      const { HowlChain } = require(${JSON.stringify(howlerPath)});
      const spriteData = require(${JSON.stringify(sharedModulePath)});
      const soundKey = ${JSON.stringify(key)};

      module.exports = new HowlChain(spriteData, soundKey, ${JSON.stringify(pluginName)});
    `);
  });
}

module.exports = audioSpriteWebpackPluginLoader;
