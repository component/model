
# model

  W.I.P minimalistic extensible model component.

## API

### model(name)

  Create a new model with the given `name`.

```js
var model = require('model');
var User = model('User');
```

### .attr(name, [meta])

  Define an attribute `name` with optional `meta` data object.

```js
var model = require('model');

var Post = model('Post')
  .attr('id')
  .attr('title')
  .attr('body')
  .attr('created_at')
  .attr('updated_at')
```

  With meta data used by plugins:

```js
var model = require('model');

var Post = model('Post')
  .attr('id', { required: true, type: 'number' })
  .attr('title', { required: true, type: 'string' })
  .attr('body', { required: true, type: 'string' })
  .attr('created_at', { type: 'date' })
  .attr('updated_at', { type: 'date' })
```

### .validate(fn)

  TODO: validation callback docs

### .use(fn)

  TODO: plugin docs

### .url([path])

  Return base url, or url to `path`.

```js
User.url()
// => "/users"

User.url('add')
// => "/users/add"
```

### .route(path)

  Set base path for urls.
  Note this is defaulted to `'/' + modelName.toLowerCase() + 's'`

```js
User.route('/api/u')

User.url()
// => "/api/u"

User.url('add')
// => "/api/u/add"
```
 
### .headers({header: value})

  Sets custom headers for static and method requests on the model.

```js  
User.headers({
  'X-CSRF-Token': 'some token',
  'X-API-Token': 'api token 
});
```

### .ATTR()

  "Getter" function generated when `Model.attr(name)` is called.

```js
var Post = model('Post')
  .attr('title')
  .attr('body')

var post = new Post;
post.title('Ferrets')
post.body('Make really good pets')
```

### .ATTR(value)

  "Setter" function generated when `Model.attr(name)` is called.

```js
var Post = model('Post')
  .attr('title')
  .attr('body')

var post = new Post({ title: 'Cats' });

post.title()
// => "Cats"

post.title('Ferrets')
post.title()
// => "Ferrets"
```

  - Emits "change" event with `(name, value, previousValue)`.
  - Emits "change ATTR" event with `(value, previousValue)`.

```js
post.on('change', function(name, val, prev){
  console.log('changed %s from %s to %s', name, prev, val)
})

post.on('change title', function(val, prev){
  console.log('changed title')
})

```

### .isNew()

  Returns `true` if the model is unsaved.

### .toJSON()

  Return a JSON representation of the model (its attributes).

### .has(attr)

  Check if `attr` is non-`null`.

### .get(attr)

  Get `attr`'s value.

### .set(attrs)

  Set multiple `attrs`.

```js
user.set({ name: 'Tobi', age: 2 })
```

### .changed([attr])

  Check if the model is "dirty" and return an object
  of changed attributes. Optionally check a specific `attr`
  and return a `Boolean`.

### .error(attr, msg)

  Define error `msg` for `attr`.

### .isValid()

  Run validations and check if the model is valid.

```js
user.isValid()
// => false

user.errors
// => [{ attr: ..., message: ... }]
```

### .url([path])

  Return this model's base url or relative to `path`:

```js
var user = new User({ id: 5 });
user.url('edit');
// => "/users/5/edit"
```

### .save(fn)

  Save or update and invoke the given callback `fn(err)`.

```js
var user = new User({ name: 'Tobi' })

user.save(function(err){

})
```

  Emits "save" when complete.

### .destroy([fn])

  Destroy and invoke optional `fn(err)`.

  Emits "destroy" when successfully deleted.

## Links

  - [Plugins](https://github.com/component/model/wiki/Plugins) for model

## Testing

```
$ npm install
$ make test &
$ open http://localhost:3000
```

# License

  MIT
