
/**
 * Module dependencies.
 */

try {
  var Emitter = require('emitter');
  var each = require('each');
} catch (e) {
  var Emitter = require('emitter-component');
  var each = require('each-component');
}

var request = require('superagent');
var noop = function(){};

/**
 * Mixin emitter.
 */

Emitter(exports);

/**
 * Expose request for configuration
 */
exports.request = request;

/**
 * Register an error `msg` on `attr`.
 *
 * @param {String} attr
 * @param {String} msg
 * @return {Object} self
 * @api public
 */

exports.error = function(attr, msg){
  this.errors.push({
    attr: attr,
    message: msg
  });
  return this;
};

/**
 * Check if this model is new.
 *
 * @return {Boolean}
 * @api public
 */

exports.isNew = function(){
  var key = this.model.primaryKey;
  return ! this.has(key);
};

/**
 * Get / set the primary key.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

exports.primary = function(val){
  var key = this.model.primaryKey;
  if (0 == arguments.length) return this[key]();
  return this[key](val);
};

/**
 * Validate the model and return a boolean.
 *
 * Example:
 *
 *    user.isValid()
 *    // => false
 *
 *    user.errors
 *    // => [{ attr: ..., message: ... }]
 *
 * @return {Boolean}
 * @api public
 */

exports.isValid = function(){
  this.validate();
  return 0 == this.errors.length;
};

/**
 * Return `false` or an object
 * containing the "dirty" attributes.
 *
 * Optionally check for a specific `attr`.
 *
 * @param {String} [attr]
 * @return {Object|Boolean}
 * @api public
 */

exports.changed = function(attr){
  var dirty = this.dirty;
  if (Object.keys(dirty).length) {
    if (attr) return !! dirty[attr];
    return dirty;
  }
  return false;
};

/**
 * Perform validations.
 *
 * @api private
 */

exports.validate = function(){
  var self = this;
  var fns = this.model.validators;
  this.errors = [];
  each(fns, function(fn){ fn(self) });
};

/**
 * Destroy the model and mark it as `.destroyed`
 * and invoke `fn(err)`.
 *
 * Events:
 *
 *  - `destroying` before deletion
 *  - `destroy` on deletion
 *
 * @param {Function} [fn]
 * @api public
 */

exports.destroy = function(fn){
  fn = fn || noop;
  if (this.isNew()) return fn(new Error('not saved'));
  var self = this;
  var url = this.url();
  this.model.emit('destroying', this);
  this.emit('destroying');
  this.request
    .del(url)
    .set(this.model._headers)
    .end(function(err, res){
      if (err || res.error)
        return fn(self._toError(err,res), res);
      self.destroyed = true;
      self.model.emit('destroy', self, res);
      self.emit('destroy');
      fn(null, res);
    });
};

/**
 * Save and invoke `fn(err)`.
 *
 * Events:
 *
 *  - `saving` pre-update or save, after validation
 *  - `save` on updates and saves
 *
 * @param {Function} [fn]
 * @api public
 */

exports.save = function(fn){
  if (!this.isNew()) return this.update(fn);
  var self = this;
  var url = this.model.url();
  var key = this.model.primaryKey;
  fn = fn || noop;
  if (!this.isValid()) return fn(new Error('validation failed'));
  this.model.emit('saving', this);
  this.emit('saving');
  this.request
    .post(url)
    .set(this.model._headers)
    .send(self)
    .end(function(err, res){
      if (err || res.error)
        return fn(self._toError(err,res), res);

      if (res.body) self.primary(res.body[key]);
      self.dirty = {};
      self.model.emit('save', self, res);
      self.emit('save');
      fn(null, res);
    });
};

/**
 * Update and invoke `fn(err)`.
 *
 * @param {Function} [fn]
 * @api private
 */

exports.update = function(fn){
  var self = this;
  var url = this.url();
  fn = fn || noop;
  if (!this.isValid()) return fn(new Error('validation failed'));
  this.model.emit('saving', this);
  this.emit('saving');
  this.request
    .put(url)
    .set(this.model._headers)
    .send(self)
    .end(function(err,res){
      if (err || res.error) 
          return fn(self._toError(err, res), res);
      self.dirty = {};
      self.model.emit('save', self, res);
      self.emit('save');
      fn(null, res);
    });
};

/**
 * Return a url for `path` relative to this model.
 *
 * Example:
 *
 *    var user = new User({ id: 5 });
 *    user.url('edit');
 *    // => "/users/5/edit"
 *
 * @param {String} path
 * @return {String}
 * @api public
 */

exports.url = function(path){
  var model = this.model;
  var url = model._base;
  var id = this.primary();
  if (0 == arguments.length) return url + '/' + id;
  return url + '/' + id + '/' + path;
};

/**
 * Set multiple `attrs`.
 *
 * @param {Object} attrs
 * @return {Object} self
 * @api public
 */

exports.set = function(attrs){
  for (var key in attrs) {
    this[key](attrs[key]);
  }
  return this;
};

/**
 * Get `attr` value.
 *
 * @param {String} attr
 * @return {Mixed}
 * @api public
 */

exports.get = function(attr){
  return this.attrs[attr];
};

/**
 * Check if `attr` is present (not `null` or `undefined`).
 *
 * @param {String} attr
 * @return {Boolean}
 * @api public
 */

exports.has = function(attr){
  return null != this.attrs[attr];
};

/**
 * Return the JSON representation of the model.
 *
 * @return {Object}
 * @api public
 */

exports.toJSON = function(){
  return this.attrs;
};

/**
 * Register a custom error handler for the model instance.
 *
 * @param {Function} fn
 * @return {Object} self
 * @api public
 */

exports.toError = function(fn) {
    if (fn) {
        this._toError = fn;
    }

    return this;
}

/**
 * Standard error handler.
 *
 * @param {Error} err
 * @param {Response} res
 * @return {Error}
 * @api private
 */

exports._toError = function(err, res) {
  if (err) return err;
  else return new Error('got ' + res.status + ' response');
}
