const listChain = [
  'play', 'pause', 'stop',
  'mute', 'volume', 'fade',
  'rate', 'seek',
  'on', 'once', 'off', 'loop',
];

let emptySound = '{\n';
listChain.forEach((method) => {
  emptySound += `${method}() { return this; },\n`;
});
emptySound += '}';

module.exports = emptySound;
