function howlerWebpackLoader() {
  const emptyHowlerPath = require.resolve('./emptyHowler');
  return `module.exports = require(${JSON.stringify(emptyHowlerPath)});`;
}

module.exports = howlerWebpackLoader;
