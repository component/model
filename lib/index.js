
try {
  var clone = require('clone');
} catch (e) {
  var clone = require('clone-component');
}

var protos = require('./protos');
var statics = require('./statics');

/**
 * Expose `createModel`.
 */

module.exports = createModel;

/**
 * Create a new model constructor with the given `name`.
 *
 * @param {String} name
 * @return {Model}
 */

function createModel (name) {
  if ('string' != typeof name) throw new TypeError('model name required');

  /**
   * Initialize a new `Model` with optional `attrs`.
   *
   * @param {Object} attrs (optional)
   */

  function Model (attrs) {
    if (!(this instanceof Model)) return new Model(attrs);
    attrs = clone(attrs) || {};
    this.attrs = attrs;
    this.Model.emit('construct', this, attrs);
  }

  Model.attrs = {};
  Model.modelName = name;
  Model.prototype.Model = Model.prototype.model = Model; // lowercase for compat
  for (var key in statics) Model[key] = statics[key];
  for (var key in protos) Model.prototype[key] = protos[key];

  return Model;
}