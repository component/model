
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