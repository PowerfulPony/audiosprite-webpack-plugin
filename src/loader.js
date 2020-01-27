const pluginName = 'audioSpriteWebpackPlugin';
const path = require('path');

function audioSpriteWebpackPluginLoader(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const done = this.async();
  const plugin = this[pluginName];
  const howlerPath = require.resolve('howler-chaining');
  const audioSprite = path.resolve(this.rootContext, `${plugin.filename}`);

  const data = {
    path: this.resourcePath,
    buffer: source,
    key: `key_${Math.random().toString(36).substring(7)}`,
  };

  const audioSpriteSoundKey = data.key;

  plugin.addAudio(data).then((audioSpritePosition) => {
    done(null, `
const { HowlChain } = require(${JSON.stringify(howlerPath)});
const audioSprite = require(${JSON.stringify(audioSprite)}).default;

const audioSpritePosition = ${JSON.stringify(audioSpritePosition)};
const audioSpriteSoundKey = ${JSON.stringify(audioSpriteSoundKey)};

const soundData = {
  src: [audioSprite],
  sprite: audioSpritePosition,
}

module.exports = new HowlChain(soundData, audioSpriteSoundKey, ${JSON.stringify(pluginName)});
    `);
  });
}

module.exports = audioSpriteWebpackPluginLoader;
module.exports.raw = true;
