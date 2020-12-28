const emptyHowler = require('./emptyHowler');

function howlerWebpackLoader() {
  return `module.exports = ${emptyHowler};`;
}

module.exports = howlerWebpackLoader;
