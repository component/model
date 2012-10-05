
var model = require('model')
  , assert = require('component-assert');

var User = model('User')
  .attr('id', { type: 'number' })
  .attr('name', { type: 'string' })
  .attr('age', { type: 'number' })

var Pet = model('Pet')
  .attr('name')
  .attr('species')

describe('model(name)', function(){
  it('should return a new model constructor', function(){
    var Something = model('Something');
    assert('function' == typeof Something);
  })
})

describe('new Model(object)', function(){
  it('should populate attrs', function(){
    var user = new User({ name: 'Tobi', age: 2 });
    assert('Tobi' == user.name());
    assert(2 == user.age());
  })
})

describe('Model(object)', function(){
  it('should populate attrs', function(){
    var user = User({ name: 'Tobi', age: 2 });
    assert('Tobi' == user.name());
    assert(2 == user.age());
  })
})

describe('Model#.<attr>(value)', function(){
  it('should set a value', function(){
    var user = new User;
    assert(user == user.name('Tobi'));
    assert('Tobi' == user.name());
  })

  it('should emit "change <attr>" events', function(done){
    var user = new User({ name: 'Tobi' });

    user.on('change name', function(val, old){
      assert('Luna' == val);
      assert('Tobi' == old);
      done();
    });

    user.name('Luna');
  })

  it('should emit "change" events', function(done){
    var user = new User({ name: 'Tobi' });

    user.on('change', function(prop, val, old){
      assert('name' == prop);
      assert('Luna' == val);
      assert('Tobi' == old);
      done();
    });

    user.name('Luna');
  })
})

describe('Model#isNew()', function(){
  it('should default to true', function(){
    var user = new User;
    assert(true === user.isNew());
  })

  it('should be false when a primary key is present', function(){
    var user = new User({ id: 0 });
    assert(false === user.isNew());
  })
})

describe('Model#model', function(){
  it('should reference the constructor', function(){
    var user = new User;
    assert(User == user.model);

    var pet = new Pet;
    assert(Pet == pet.model);
  })
})

describe('Model#set(attrs)', function(){
  it('should set several attrs', function(){
    var user = new User;
    user.set({ name: 'Tobi', age: 2 });
    assert('Tobi' == user.name());
    assert(2 == user.age());
  })
})

describe('Model#get(attr)', function(){
  it('should return an attr value', function(){
    var user = new User({ name: 'Tobi' });
    assert('Tobi' == user.get('name'));
  })
})

describe('Model#has(attr)', function(){
  it('should check if attr is not null or undefined', function(){
    var user = new User({ name: 'Tobi' });
    assert(true === user.has('name'));
    assert(false === user.has('age'));
  })
})

describe('Model#url(path)', function(){
  // it('should construct a pathname', function(){
  //   var user = new User;
  //   assert('/user/edit' == user.url('edit'));
  // })

  describe('when .isNew()', function(){
    it('should include .id', function(){
      var user = new User;
      user.id(5);
      assert('/user/5' == user.url());
      assert('/user/5/edit' == user.url('edit'));
    })
  })
})

describe('Model#toJSON()', function(){
  it('should return the attributes', function(){
    var user = new User({ name: 'Tobi', age: 2 });
    var obj = user.toJSON();
    assert('Tobi' == obj.name);
    assert(2 == obj.age);
  })
})

describe('Model#isValid()', function(){
  var User = model('User')
    .attr('name')
    .attr('email');

  User.validate(function(user){
    if (!user.has('name')) user.error('name', 'name is required');
  });

  User.validate(function(user){
    if (!user.has('email')) user.error('email', 'email is required');
  });

  it('should populate .errors', function(){
    var user = new User;
    assert(false === user.isValid());
    assert(2 == user.errors.length);
    assert('name' == user.errors[0].attr);
    assert('name is required' == user.errors[0].message);
    assert('email' == user.errors[1].attr);
    assert('email is required' == user.errors[1].message);
  })

  it('should return false until valid', function(){
    var user = new User;
    assert(false === user.isValid());
    assert(2 == user.errors.length);

    user.name('Tobi');
    assert(false === user.isValid());
    assert(1 == user.errors.length);

    user.email('tobi@learnboost.com');
    assert(true === user.isValid());
    assert(0 == user.errors.length);
  })
})