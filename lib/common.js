if(require('is-browser')) {
  exports.emitter = require('emitter');
  exports.collection = require('collection');
  exports.each = require('each');
} else {
  exports.emitter = require('emitter-component');
  exports.collection = Array;
  exports.each = function(arr, fn) {
    return arr.forEach(fn);
  };
}
