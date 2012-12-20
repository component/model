/**
 * AJAX Transport
 */

/**
 * Module dependencies
 */

var request = require('superagent');

/**
 * Create
 */

exports.create = function(fn) {
  var url = this.model.url();
  request.post(url, this, function(res) {
    fn(res.error, res.body);
  });
};

/**
 * Read
 */

exports.read = function(id, fn) {
  var url;

  if (arguments.length == 1) {
    fn = id;
    url = this.url('all');
  } else {
    url = this.url(id);
  }

  request.get(url, function(res) {
    fn(res.error, res.body);
  });
};

/**
 * Update
 */

exports.update = function(fn) {
  var url = this.url();
  request.put(url, this, function(res) {
    fn(res.error, res.body);
  });
};

/**
 * Destroy
 */

exports.destroy = function(fn) {
  var url = (this.model) ? this.url() : this.url('all');

  request.del(url, function(res) {
    fn(res.error, res.body);
  });
};
