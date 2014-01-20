# model

  A super simple, pluggable model.

## Installation

    $ component install component/model

## Example

```js
var model = require('model');
var defaults = require('model-defaults');
var http = require('model-http');

/**
 * User model.
 */

var User = model()
  .use(http('/users'))
  .use(defaults())
  .attr('id')
  .attr('name')
  .attr('email')
  .attr('created', { default: function () { return new Date(); }})
  .attr('version', { default: 1 });

/**
 * In use...
 */

var user = new User({ name: 'Fred' });
user.name('George');
user.email('george@washington.gov');
user.save(function (err) {
  if (err) throw err;
  console.log('saved', user.toJSON());
});
```

## Plugins
  - TODO

## API

#### model()

  Return a new model constructor.

#### .use(fn)

  Use the given plugin `fn`.

#### .primary(key)

  Set the model's primary `key`, which defaults to `'id'`.

#### .attr(name, options)

  Define a new model attr by `name` with optional `options`. Doing this will create a getter/setter method on the prototype with the same `name`.

#### #primary([value])

  Get the value of the model's primary attribute, or set it to `value`.

#### #<attr>([value])

  Get the value of an `<attr>`, or set it to a `value`.

#### #set(obj)

  Set multiple attributes at a time with an `obj`.

#### #get(attr)

  Get the value of `attr`.

#### #has(attr)

  Check if `attr` is not null or undefined.

#### #toJSON()

  Return a JSON representation of the model.

# License

  MIT
