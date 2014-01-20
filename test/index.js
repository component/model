
var assert = require('assert');

try {
  var create = require('model');
} catch (e) {
  var create = require('..');
}

describe('factory', function () {
  it('should expose a factory', function () {
    assert.equal('function', typeof create);
  });

  it('should have a reference to itself on the prototype', function () {
    var Model = create('user');
    assert.equal(Model, Model.prototype.Model);
  });

  it('should set a clone of attrs on construct', function () {
    var attrs = {};
    var Model = create('user');
    var model = new Model(attrs);
    assert.notEqual(attrs, model.attrs);
    assert.deepEqual(attrs, model.attrs);
  });

  it('should default attrs to an empty object', function () {
    var Model = create('user');
    var model = new Model();
    assert.deepEqual({}, model.attrs);
  });

  it('should not require the new keyword', function () {
    var Model = create('user');
    var model = new Model();
    assert(model instanceof Model);
  });

  it('should emit on construct', function (done) {
    var Model = create('user').attr('name');
    var attrs = { name: 'Name' };

    Model.on('construct', function (model, att) {
      assert.deepEqual(attrs, att);
      done();
    });

    new Model(attrs);
  });

  it('should have emitter mixed in', function () {
    var Model = create('user');
    assert.equal('function', typeof Model.on);
    assert.equal('function', typeof Model.off);
    assert.equal('function', typeof Model.once);

    var model = new Model();
    assert.equal('function', typeof model.on);
    assert.equal('function', typeof model.off);
    assert.equal('function', typeof model.once);
  });

  describe('.attrs', function () {
    it('should store attr definitions', function () {
      var Model = create('user');
      var def = { default: 0 };
      Model.attr('name', def);
      assert.deepEqual({ name: def }, Model.attrs);
    });
  });

  describe('.use', function () {
    it('should apply a plugin', function (done) {
      var Model = create('user');
      Model.use(function (Constructor) {
        assert.equal(Model, Constructor);
        done();
      });
    });
  });

  describe('.attr', function () {
    it('should store options', function () {
      var Model = create('user');
      var options = { option: true };
      Model.attr('name', options);
      assert.equal(options, Model.attrs.name);
    });

    it('should create a getter/setter', function () {
      var Model = create('user');
      Model.attr('name');
      var model = new Model();
      assert.equal('function', typeof model.name);
      assert.equal(model, model.name('value'));
      assert.equal('value', model.attrs.name);
      assert.equal('value', model.name());
    });
  });

  describe('.primary', function () {
    it('should get and set the primary key', function () {
      var Model = create('user').attr('name');
      assert.equal(Model, Model.primary('name'));
      assert.equal('name', Model.primary());
    });

    it('should default to "id"', function () {
      var Model = create('user');
      assert.equal('id', Model.primary());
    });
  });

  describe('#primary', function () {
    it('should get the primary key\'s value', function () {
      var Model = create('user').attr('name').primary('name');
      var model = new Model({ name: 'value' });
      assert.equal('value', model.primary());
    });

    it('should set the primary key\'s value', function () {
      var Model = create('user').attr('name').primary('name');
      var model = new Model();
      assert.equal(model, model.primary('value'));
      assert.equal('value', model.name());
    });

    it('should fallback to a primary key of "id"', function () {
      var Model = create('user').attr('id');
      var model = new Model({ id: 'value' });
      assert.equal('value', model.primary());
    });
  });

  describe('#set', function () {
    it('should set multiple attrs at once', function () {
      var Model = create('user').attr('one').attr('two');
      var model = new Model();
      assert.equal(model, model.set({ one: 1, two: 2 }));
      assert.equal(1, model.one());
      assert.equal(2, model.two());
    });
  });

  describe('#get', function () {
    it('should get an attr by name', function () {
      var Model = create('user').attr('name');
      var model = new Model({ name: 'Name' });
      assert.equal('Name', model.get('name'));
    });
  });

  describe('#has', function () {
    it('should check an attr by name', function () {
      var Model = create('user').attr('one').attr('two').attr('three');
      var model = new Model({ one: true, two: null });
      assert(model.has('one'));
      assert(!model.has('two'));
      assert(!model.has('three'));
    });
  });

  describe('#toJSON', function () {
    it('should return a clone of the models attrs', function () {
      var attrs = { name: 'Name' };
      var Model = create('user');
      var model = new Model(attrs);
      assert.notEqual(model.attrs, model.toJSON());
      assert.deepEqual(model.attrs, model.toJSON());
    });
  });
});