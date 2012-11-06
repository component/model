
var model = require('model')
  , assert = require('component-assert');

var User = model('User')
  .attr('id', { type: 'number' })
  .attr('name', { type: 'string' })
  .attr('age', { type: 'number' })

describe('Model.url()', function(){
  it('should return the base url', function(){
    assert('/user' == User.url());
  })
})

describe('Model.url(string)', function(){
  it('should join', function(){
    assert('/user/edit' == User.url('edit'));
  })
})

describe('Model.attrs', function(){
  it('should hold the defined attrs', function(){
    assert('string' == User.attrs.name.type);
    assert('number' == User.attrs.age.type);
  })
})

describe('Model.all(fn)', function(){
  beforeEach(function(done){
    User.removeAll(done);
  });

  beforeEach(function(done){
    var tobi = new User({ name: 'tobi', age: 2 });
    var loki = new User({ name: 'loki', age: 1 });
    var jane = new User({ name: 'jane', age: 8 });
    tobi.save(function(){
      loki.save(function(){
        jane.save(done);
      });
    });
  })

  it('should respond with a collection of all', function(done){
    User.all(function(err, users){
      assert(!err);
      assert(3 == users.length());
      assert('tobi' == users.at(0).name());
      assert('loki' == users.at(1).name());
      assert('jane' == users.at(2).name());
      done();
    });
  })
})