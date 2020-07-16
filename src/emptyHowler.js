const methods = ['init', 'volume', 'mute', 'stop', 'unload', 'codecs'];

let emptyHowler = '{\n';
methods.forEach((method) => {
  emptyHowler += `${method}() { return this; },\n`;
});
emptyHowler += '}';

module.exports = emptyHowler;
