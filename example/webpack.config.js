const { resolve } = require('path');
const fs = require('fs/promises');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const audioSpriteWebpackPlugin = require('../src/index');

const audioSupport = true;

const config = {
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
        test: /\.(mp3|wav)$/,
        include: /(sounds)/,
        loader: audioSpriteWebpackPlugin.loader,
        options: {
          emptySprite: !audioSupport,
        },
      },
      {
        test: /audioSpriteName\.(mp3|ogg)$/,
        exclude: /(sounds)/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Example',
    }),
    new audioSpriteWebpackPlugin.Plugin({
      audiosprite: {
        output: 'audioSpriteName',
        export: ['mp3','ogg'],
        bitrate: 64
      }
    }),
  ],
};

if (!audioSupport) {
  config.module.rules.push({
    test: /howler/,
    loader: audioSpriteWebpackPlugin.emptyHowlerLoader,
  });
}

module.exports = config;
