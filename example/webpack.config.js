const { resolve } = require('path');
const { Buffer } = require('buffer');
const fs = require('fs/promises');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  Plugin: AudiospriteWebpackPlugin,
  loaderPath: audiospriteWebpackLoader,
} = require('../src/index');

const metaFilename = 'meta.js';
const artifactFilename = 'sprite.mp3';
const artifactReg = new RegExp(`${artifactFilename}$`);

module.exports = {
  devtool: 'source-map',
  entry: resolve(__dirname, 'index.js'),
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: resolve(__dirname, 'dist'),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /.mp3$/,
        exclude: artifactReg,
        loader: audiospriteWebpackLoader,
      },
      {
        test: /.mp3$/,
        include: artifactReg,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Example',
    }),
    new AudiospriteWebpackPlugin({
      metaFilename,
      artifactFilename,
      bitrate: 64,
    }),
  ],
};
