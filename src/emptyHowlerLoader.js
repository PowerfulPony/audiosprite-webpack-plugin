function emptyHowlerLoader() {
  const methods = ['init', 'volume', 'mute', 'stop', 'unload', 'codecs'];

  let replacedHowler = '{Howler: {\n';
  methods.forEach((method) => {
    replacedHowler += `${method}() { return this; },\n`;
  });
  replacedHowler += '}}';

  return `module.exports = ${replacedHowler};`;
}

module.exports = emptyHowlerLoader;
