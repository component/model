
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
  var url = this.base;
  if (0 == arguments.length) return url;
  return url + '/' + path;
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
    this.emit('change', name, val, this.attrs[name]);
    this.emit('change ' + name, val, this.attrs[name]);
    this.dirty[name] = val;
    this.attrs[name] = val;
    return this;
  };

  return this;
};

// TODO: replace all this junk with superagent and add tests

exports.get = function(id, fn){
  var self = this;
  var url = this.url(id);
  request('GET', url, function(err, res){
    if (err) return fn(err);
    var model = new self(res.body);
    fn(null, model);
  });
};

function request(method, url, fn) {
  var req = new XMLHttpRequest;
  req.open(method, url, true);
  req.onreadystatechange = function(){
    if (4 == req.readyState) {
      var status = req.status / 100 | 0;
      var type = (req.getResponseHeader('Content-Type') || '').split(';')[0];
      var json = 'application/json' == type;
      if (2 == status) {
        if (json) req.body = require('json').parse(req.responseText);
        fn(null, req);
      } else {
        fn(new Error('got ' + req.status + ' response'));
      }
    }
  };
  req.send(null);
}