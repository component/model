
/**
 * Module dependencies.
 */

var Enumerable = require('enumerable');

/**
 * Expose `Collection`.
 */

module.exports = Collection;

/**
 * Initialize a new collection with the given `models`.
 *
 * @param {Array} models
 * @api public
 */

function Collection(models) {
  this.models = models || [];
}

/**
 * Mixin enumerable.
 */

Enumerable(Collection.prototype);

/**
 * Iterator implementation.
 */

Collection.prototype.__iterate__ = function(){
  var self = this;
  return {
    length: function(){ return self.length() },
    get: function(i){ return self.models[i] }
  }
};

/**
 * Return the collection length.
 *
 * @return {Number}
 * @api public
 */

Collection.prototype.length = function(){
  return this.models.length;
};

/**
 * Add `model` to the collection and return the index.
 *
 * @param {Object} model
 * @return {Number}
 * @api public
 */

Collection.prototype.push = function(model){
  return this.models.push(model);
};
