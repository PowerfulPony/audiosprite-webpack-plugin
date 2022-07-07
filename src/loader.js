const path = require('path');
const { getOptions } = require('loader-utils'); // eslint-disable-line import/no-unresolved
const { pluginName } = require('./consts');
const emptySound = require('./emptySound');

function getOption(...options) {
  return options.some((option) => {
    const regExp = new RegExp(`^\\?{"${option}":true}$`);

    return (getOptions(this) && getOptions(this)[option])
    || (regExp.test(this.resourceQuery) && JSON.parse(this.resourceQuery.replace(/^\?/, ''))[option]);
  });
}

function audioSpriteWebpackPluginLoader() { // eslint-disable-line consistent-return
  const emptySprite = getOption.call(this, 'empty', 'emptySprite');

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
