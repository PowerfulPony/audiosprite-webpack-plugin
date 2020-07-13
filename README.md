# Webpack Loader & Plugin For Create Audio Sprite 

## Usage

```
npm install audiosprite-webpack-plugin --save-dev
```

**`webpack.config.js`**

```javascript
const audioSpriteWebpackPlugin = require('audiosprite-webpack-plugin');
const needInSounds = true;

const config = {
  plugins: [
    new audioSpriteWebpackPlugin.Plugin({
      audiosprite: {
        output: 'audioSpriteName',
        export: 'mp3,ogg,ac3,m4a,caf',
        bitrate: 64
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(mp3|wav)$/,
        include: /(sounds)/,
        loader: audioSpriteWebpackPlugin.loader,
        options: {
          emptySprite: needInSounds,
        },
      },
      {
        test: /audioSpriteName\.(mp3|ogg|ac3|m4a|caf)$/,
        exclude: /(sounds)/,
        loader: 'file-loader'
      }
    ]
  }
};

if (needInSounds) {
  config.module.rules.push({
    test: /howler/,
    loader: audioSpriteWebpackPlugin.howlerLoader,
  });
}

module.exports = config;
```

**`index.js`**

```javascript
import blasterShot from '@/assets/sounds/blasterShot.mp3';

blasterShot.play().fade(1, 0, 300);
```

## Dependencies

[tonistiigi/audiosprite](https://github.com/tonistiigi/audiosprite#dependencies)
You need to install [ffmpeg](https://www.ffmpeg.org/)

## License

MIT
