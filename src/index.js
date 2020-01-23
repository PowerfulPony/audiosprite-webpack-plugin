const audiosprite = require('audiosprite');
const debounce = require('lodash.debounce');
const path = require('path');
const fs = require('fs');

const pluginName = 'audioSpriteWebpackPlugin';

class AudioSpriteWebpackPlugin {
  constructor(config = {}) {
    this.config = {
      format: 'howler2',
      export: 'm4a',
      channels: 1,
      bitrate: 64,
      samplerate: 44100,
      output: 'audiosprite',
      ...config,
    };

    this.filename = `${this.config.output}.${this.config.export}`;
    this.audios = {};
    this.debounced = debounce(this.genSprite, 100);
    this.compilation = undefined;
    this.promise = undefined;
    this.outputPath = undefined;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      this.outputPath = compilation.compiler.outputPath;
      compilation.hooks
        .normalModuleLoader
        .tap(pluginName, (loaderContext) => {
          this.compilation = compilation;
          loaderContext[pluginName] = this; // eslint-disable-line
        });
    });
  }

  addAudio({ path, buffer, key }) { // eslint-disable-line
    this.audios[path] = {
      buffer,
      key,
    };
    return this.getCurrentPromise();
  }

  genPromise() {
    this.promise = new Promise((resolve) => {
      this.debounced(resolve);
    });
    return this.promise;
  }

  getCurrentPromise() {
    return this.promise || this.genPromise();
  }

  genSprite(resolve) {
    const audiosPath = Object.keys(this.audios).sort();

    const spritePath = path.resolve(this.outputPath, this.config.output);

    audiosprite(audiosPath, {
      ...this.config,
      output: spritePath,
    }, (err, data) => {
      const metadata = {};
      Object.keys(data.sprite).forEach((key, index) => {
        const track = data.sprite[key];
        track[1] = Math.ceil(track[1]);
        metadata[this.audios[audiosPath[index]].key] = track;
      });

      resolve(metadata);
    });
  }
}

AudioSpriteWebpackPlugin.loader = require.resolve('./loader');

module.exports = AudioSpriteWebpackPlugin;
