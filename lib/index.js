
/**
 * Module dependencies.
 */

var proto = require('./proto')
  , statics = require('./static')
  , Emitter = require('emitter');

/**
 * Expose `createModel`.
 */

module.exports = createModel;

/**
 * Create a new model constructor with the given `name`.
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function createModel(name, attrDefs) {
  if ('string' != typeof name) throw new TypeError('model name required');

  /**
   * Initialize a new model with the given `attrs`.
   *
   * @param {Object} attrs
   * @api public
   */

  function model(attrs) {
    if (!(this instanceof model)) return new model(attrs);
    this._callbacks = {};
    this.attrs = {};
    this.dirty = {};
    if (attrs) this.set(attrs);
  }

  // mixin emitte

  Emitter(model);

  // statics

  model.modelName = name;
  model.base = '/' + name.toLowerCase();
  model.attrs = {};
  model.validators = [];
  for (var key in statics) model[key] = statics[key];

  // prototype

  model.prototype = {};
  model.prototype.model = model;
  for (var key in proto) model.prototype[key] = proto[key];

  if (attrDefs) for (var attr in attrDefs) model.attr(attr, attrDefs[attr]);

  return model;
}

