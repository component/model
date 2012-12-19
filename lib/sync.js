/**
 * Module dependencies
 */

var request = require('superagent');

/**
 * Create
 */

exports.create = function() {

};

/**
 * Read
 */

exports.read = function(id, fn) {
  if(arguments.length == 1) fn = id;
  var url = this.url('all');
  request.get(url, function(res) {
    return fn(res.error, res.body);
  });
};

/**
 * Update an item
 */

exports.update = function() {

};

/**
 * Destroy
 */

exports.destroy = function() {

};
