# Webpack Loader & Plugin For Create Audio Sprite 

## Usage

```
npm install audiosprite-webpack-plugin --save-dev
```

**`webpack.config.js`**

```javascript
const audioSpriteWebpackPlugin = require('audiosprite-webpack-plugin');
const audioSupport = true;

const config = {
  plugins: [
    new audioSpriteWebpackPlugin.Plugin({
      audiosprite: {
        output: 'audioSpriteName',
        export: ['mp3','ogg','ac3','m4a','caf'],
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
          emptySprite: !audioSupport,
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

if (!audioSupport) {
  config.module.rules.push({
    test: /howler/,
    loader: audioSpriteWebpackPlugin.emptyHowlerLoader,
  });
}

module.exports = config;
```

**`index.js`**

```javascript
import blasterShot from '@/assets/sounds/blasterShot.mp3';

blasterShot.play().fade(1, 0, 300);
```

**Inline option for replacing sound with an emty howler instance if you are using webpack variables**

```javascript
const anySound = require(`@/assets/sounds/any-sound.mp3${WEBPACK_VARIABLE === 'a' && '?{"empty": true}'}`);
```
## Dependencies

[aapavlov1994/audiosprite-breezy](https://github.com/aapavlov1994/audiosprite-breezy#readme)
You need to install [ffmpeg](https://www.ffmpeg.org/)

## License

MIT
