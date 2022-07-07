const fs = require('fs-extra');
const path = require('path');
const { createSprite } = require('audiosprite-breezy');
const findCacheDir = require('find-cache-dir');
const debounce = require('lodash.debounce');

const {
  pluginName,
  packageName,
} = require('./consts');

const cacheThunk = findCacheDir({
  name: packageName,
  create: true,
  thunk: true,
});

const srcList = [];

class AudioSpriteWebpackPlugin {
  constructor(config) {
    config.audiosprite.format = 'howler2'; // eslint-disable-line no-param-reassign
    this.config = { ...config };
    this.filename = this.config.audiosprite.output;
    this.time = new Date();
    this.assetPromise = undefined;
    this.assetPromiseResolve = undefined;
    this.debounceCreateAssets = undefined;
  }

  apply(compiler) {
    this.cacheCompilerDir = AudioSpriteWebpackPlugin.getCacheDist(compiler);
    this.sharedModulePath = path.join(this.cacheCompilerDir, `${this.filename}.js`);

    this.debounceCreateAssets = debounce(() => {
      this.createAssets(compiler).then(() => {
        this.assetPromiseResolve();
        this.assetPromise = undefined;
        this.assetPromiseResolve = undefined;
      });
    }, 1000);

    compiler
      .hooks
      .thisCompilation
      .tap(pluginName, (compilation) => {
        const loader = compiler.webpack && compiler.webpack.NormalModule
          ? compiler.webpack.NormalModule.getCompilationHooks(compilation).loader
          : compilation.hooks.normalModuleLoader;
        loader.tap(pluginName, (loaderContext) => {
          loaderContext[pluginName] = this; // eslint-disable-line no-param-reassign
        });
      });
  }

  assignPromise() {
    if (!this.assetPromise) {
      this.assetPromise = new Promise((resolve) => {
        this.assetPromiseResolve = resolve;
      });
    }
  }

  registerSound(soundPath) {
    if (srcList.indexOf(soundPath) === -1) {
      srcList.push(soundPath);
      srcList.sort();
    }

    this.assignPromise();
    this.debounceCreateAssets();

    return this.assetPromise;
  }

  static getKey(basePath, fullPath) {
    return path.relative(basePath, fullPath)
      // eslint-disable-next-line prefer-regex-literals
      .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
      .toLowerCase();
  }

  static getCacheKey(compiler) {
    return compiler.name || (compiler.options.name || '');
  }

  static getCacheDist(compiler) {
    return cacheThunk(AudioSpriteWebpackPlugin.getCacheKey(compiler));
  }

  createJs(compiler, spriteData) {
    return new Promise((resolve) => {
      const basePath = compiler.context;

      let output = '';

      spriteData.src.forEach((spritePath, index) => {
        output += `const sprite${index} = require(${JSON.stringify(spritePath)});\n`;
      });

      output += '\n';
      output += 'const spriteData = {\n';

      output += '  src: [\n';
      spriteData.src.forEach((spritePath, index) => {
        output += `    sprite${index}.default || sprite${index},\n`;
      });
      output += '  ],\n';

      output += `  format: ${JSON.stringify(this.config.audiosprite.export)},\n`;

      output += '  sprite: {\n';
      Object.keys(spriteData.sprite).forEach((key, index) => {
        const track = spriteData.sprite[key];
        const soundPath = srcList[index];
        const soundKey = AudioSpriteWebpackPlugin.getKey(basePath, soundPath);

        track[1] = Math.floor(track[1]);
        output += `    "${soundKey}": ${JSON.stringify(track)},\n`;
      });
      output += '  },\n';

      output += '};\n\n';

      output += 'module.exports = spriteData;';

      fs.outputFile(
        this.sharedModulePath,
        output,
        'utf8',
        () => resolve(output),
      );
    });
  }

  createAssets(compiler) {
    return createSprite(srcList, {
      ...this.config.audiosprite,
      output: path.join(this.cacheCompilerDir, this.config.audiosprite.output),
    })
      .then((spriteData) => this.createJs(compiler, spriteData));
  }
}

module.exports = AudioSpriteWebpackPlugin;
