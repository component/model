
try {
  var Emitter = require('emitter');
} catch (e) {
  var Emitter = require('emitter-component');
}

/**
 * Mixin emitter.
 */

Emitter(exports);

/**
 * Use a `plugin`.
 *
 * @param {Function} plugin
 * @return {Model}
 */

exports.use = function (plugin) {
  plugin(this);
  return this;
};

/**
 * Get or set the model's primary `key`.
 *
 * @param {String} key
 * @return {String or Model}
 */

exports.primary = function (key) {
  if (!arguments.length) return this._primary || 'id';
  this._primary = key;
  return this;
};

/**
 * Define a new `attr` with optional `options`.
 *
 * @param {String} attr
 * @param {Object} options (optional)
 * @return {Model}
 */

exports.attr = function (attr, options) {
  this.attrs[attr] = options || {};

  /**
   * Get or set a `value`.
   *
   * @param {Mixed} value
   * @return {Mixed}
   */

  this.prototype[attr] = function (val) {
    if (!arguments.length) return this.attrs[attr];
    this.attrs[attr] = val;
    return this;
  };

  return this;
};