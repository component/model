/**
 * Module dependencies.
 */

var Collection = require('collection');
var request = require('superagent');
var noop = function(){};

/**
 * Expose request for configuration
 */

exports.request = request;

/**
 * Construct a url to the given `path`.
 *
 * Example:
 *
 *    User.url('add')
 *    // => "/users/add"
 *
 * @param {String} path
 * @return {String}
 * @api public
 */

exports.url = function(path){
  var url = this._base;
  if (0 == arguments.length) return url;
  return url + '/' + path;
};

/**
 * Set base path for urls.
 * Note this is defaulted to '/' + modelName.toLowerCase() + 's'
 *
 * Example:
 *
 *   User.route('/api/u')
 *
 * @param {String} path
 * @return {Function} self
 * @api public
 */

exports.route = function(path){
  this._base = path;
  return this;
}

/**
 * Add custom http headers to all requests.
 *
 * Example:
 *
 *   User.headers({
 *    'X-CSRF-Token': 'some token',
 *    'X-API-Token': 'api token
 *   });
 *
 * @param {String|Object} header(s)
 * @param {String} value
 * @return {Function} self
 * @api public
 */

exports.headers = function(headers){
  for(var i in headers){
    this._headers[i] = headers[i];
  }
  return this;
};

/**
 * Add validation `fn()`.
 *
 * @param {Function} fn
 * @return {Function} self
 * @api public
 */

exports.validate = function(fn){
  this.validators.push(fn);
  return this;
};

/**
 * Use the given plugin `fn()`.
 *
 * @param {Function} fn
 * @return {Function} self
 * @api public
 */

exports.use = function(fn){
  fn(this);
  return this;
};

/**
 * Define attr with the given `name` and `options`.
 *
 * @param {String} name
 * @param {Object} options
 * @return {Function} self
 * @api public
 */

exports.attr = function(name, options){
  this.attrs[name] = options || {};

  // implied pk
  if ('_id' == name || 'id' == name) {
    this.attrs[name].primaryKey = true;
    this.primaryKey = name;
  }

  // getter / setter method
  this.prototype[name] = function(val){
    if (0 == arguments.length) return this.attrs[name];
    var prev = this.attrs[name];
    this.dirty[name] = val;
    this.attrs[name] = val;
    this.model.emit('change', this, name, val, prev);
    this.model.emit('change ' + name, this, val, prev);
    this.emit('change', name, val, prev);
    this.emit('change ' + name, val, prev);
    return this;
  };

  return this;
};

/**
 * Remove all and invoke `fn(err)`.
 *
 * @param {Function} [fn]
 * @api public
 */

exports.destroyAll = function(fn){
  fn = fn || noop;
  var self = this;
  var url = this.url('');
  this.request
    .del(url)
    .set(this._headers)
    .end(function(err, res){
      if (err || res.error)
        return fn(self._toError(err,res), null, res);
      fn(null, [], res);
    });
};

/**
 * Get all and invoke `fn(err, array)`.
 *
 * @param {Function} fn
 * @api public
 */

exports.all = function(fn){
  var self = this;
  var url = this.url('');
  this.request
    .get(url)
    .set(this._headers)
    .end(function(err, res){
      if (err || res.error)
        return fn(self._toError(err,res), null, res);
      var col = new Collection;
      for (var i = 0, len = res.body.length; i < len; ++i) {
        col.push(new self(res.body[i]));
      }
      fn(null, col, res);
    });
};

/**
 * Get `id` and invoke `fn(err, model)`.
 *
 * @param {Mixed} id
 * @param {Function} fn
 * @api public
 */

exports.get = function(id, fn){
  var self = this;
  var url = this.url(id);
  this.request
    .get(url)
    .set(this._headers)
    .end(function(err, res){
      if (err || res.error)
        return fn(self._toError(err,res), null, res);
      var model = new self(res.body);
      fn(null, model, res);
    });
};

/**
 * Register a custom error handler for the model class and its instances.
 *
 * @param {Function} fn
 * @return {Object} self
 * @api public
 */
exports.toError = function(fn) {
    if (fn) {
        this._toError = this.prototype._toError = fn;
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
