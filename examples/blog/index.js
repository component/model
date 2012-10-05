
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var posts = [];

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/build.js', function(req, res){
  res.sendfile('build.js', { root: __dirname + '/../../build' });
});

app.get('/posts', function(req, res){
  res.send(posts);
});

app.get('/post/:id', function(req, res){
  var post = posts[req.params.id];
  if (post) {
    res.send(post);
  } else {
    res.send(404);
  }
});

app.post('/post', function(req, res){
  console.log('add post %j', req.body);
  var id = posts.push(req.body) - 1;
  res.send({ id: id }, 201);
});

app.put('/post/:id', function(req, res){
  var id = req.params.id;
  console.log('update post %s %j', id, req.body);
  posts[id] = req.body;
  res.send(201);
});

app.del('/post/:id', function(req, res){
  var id = req.params.id;
  console.log('delete post %s', id);
  posts.splice(id, 1);
  res.send(200);
});

app.listen(3000);
console.log('Application listening on port 3000');