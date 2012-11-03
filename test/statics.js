
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
    User.destroyAll(done);
  });

  beforeEach(function(done){
    var tobi = new User({ name: 'tobi' });
    var loki = new User({ name: 'loki' });
    var jane = new User({ name: 'jane' });
    tobi.save(function(){
      loki.save(function(){
        jane.save(done);
      });
    });
  })

  it('should respond with an array of all', function(done){
    User.all(function(err, users){
      assert(!err);
      assert(3 == users.length);
      assert('tobi' == users[0].name());
      assert('loki' == users[1].name());
      assert('jane' == users[2].name());
      done();
    });
  })
})