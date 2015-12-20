var smidge = require('../src/smidge.js');

var when = smidge.time('today');

console.log(when.context.kind === smidge.TIME_KIND.EVENT);
console.log(when.context.chunk === smidge.TIME_CHUNK.DAY);
console.log(when.decide().getDate() === (new Date()).getDate());
console.log(when.variance());