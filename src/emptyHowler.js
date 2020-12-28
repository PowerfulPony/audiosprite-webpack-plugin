const methods = ['init', 'volume', 'mute', 'stop', 'unload', 'codecs'];

let emptyHowler = '{Howler: {\n';
methods.forEach((method) => {
  emptyHowler += `${method}() { return this; },\n`;
});
emptyHowler += '}}';

module.exports = emptyHowler;
