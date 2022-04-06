const fs = require('fs/promises');
const path = require('path');
const { Buffer } = require('buffer');
const findCacheDir = require('find-cache-dir');
const audiosprite = require('audiosprite');
const { Plugin: AccumulatorWebpackPlugin } = require('accumulator-webpack-plugin');

const {
  NAMESPACE,
  packageName,
} = require('./consts');

const cacheThunk = findCacheDir({
  name: packageName,
  create: true,
  thunk: true,
});

class AudiospriteWebpackPlugin {
  constructor(options = {}) {
    this.accumulator = undefined;
    this.options = options;
    this.metaFilename = options.metaFilename;
    this.artifactFilename = options.artifactFilename;
  }

  createSprite(list) {
    const format = path.extname(this.artifactFilename).substring(1);
    const filename = '';
    // return new Promise((resolve) => {
    //   audiosprite(list, {
    //     ...this.config.audiosprite,
    //     output: path.join(this.cacheCompilerDir, this.config.audiosprite.output),
    //   }, (err, spriteData) => {

    //   });
    // });
  }

  apply(compiler) {
    this.accumulator = new AccumulatorWebpackPlugin({
      metaFilename: this.metaFilename,
      artifactFilename: this.artifactFilename,
      accumulate(register) {
        const reads = register
          .map(({ hash, path }) => fs.readFile(path)
            .then((buffer) => ({
              hash,
              path,
              buffer,
            })));

        return Promise.all(reads)
          .then((items) => {
            const index = {};
            let offset = 0;
            const buffer = Buffer.concat(items.map((item) => {
              index[item.hash] = [offset, item.buffer.length];
              offset += item.buffer.length;
              return item.buffer;
            }));

            return { index, buffer };
          });
      },
    });
    this.accumulator.apply(compiler);
  }
}

module.exports = AudiospriteWebpackPlugin;
