
try {
  var clone = require('clone');
  var Emitter = require('emitter');
} catch (e) {
  var clone = require('clone-component');
  var Emitter = require('emitter-component');
}

/**
 * Mixin emitter.
 */

Emitter(exports);

/**
 * Get or set the model's primary key `value`.
 *
 * @param {Mixed} value (optional)
 * @return {Mixed}
 */

exports.primary = function (value) {
  var key = this.Model.primary();
  if (!arguments.length) return this[key]();
  return this[key](value);
};

/**
 * Set multiple `attrs`.
 *
 * @param {Object} attrs
 * @return {Model}
 */

exports.set = function (attrs) {
  for (var key in attrs) this[key](attrs[key]);
  return this;
};

/**
 * Get the value of an `attr`.
 *
 * @param {String} attr
 * @return {Mixed}
 */

exports.get = function (attr) {
  return this.attrs[attr];
};

/**
 * Check if `attr` is not null or undefined.
 *
 * @param {String} attr
 * @return {Boolean}
 */

exports.has = function (attr) {
  return null != this.attrs[attr];
};

/**
 * Return a JSON representation of the model.
 *
 * @return {Object}
 */

exports.toJSON = function () {
  return clone(this.attrs);
};