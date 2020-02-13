# Webpack Loader & Plugin For Create Audio Sprite 

## Usage

```
npm install audiosprite-webpack-plugin --save-dev
```

**`webpack.config.js`**

```javascript
const audioSpriteWebpackPlugin = require('audiosprite-webpack-plugin');

const spriteFilename = 'audiosprite';

module.exports = {
  plugins: [
    new audioSpriteWebpackPlugin.Plugin({
      audiosprite: {
        output: spriteFilename,
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
      },
      {
        test: /audiosprite\.(mp3|m4a)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  }
}
```

**`index.js`**

```javascript
import piupiu from '@/assets/sounds/piupiu.mp3';

piupiu
  .play()
  .fade(1, 0, 1300);
```

## Dependencies

[tonistiigi/audiosprite](https://github.com/tonistiigi/audiosprite#dependencies)
You need to install [ffmpeg](https://www.ffmpeg.org/)

## License

MIT