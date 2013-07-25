
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

// middleware

app.use(express.logger('dev'));
app.use(express.query());
app.use(express.bodyParser());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/..'));

// faux db

var db = { pets: [], users: [] };

// routes

/**
 * DELETE everythinggggg.
 */

app.del('/', function(req, res){
  db.pets = [];
  db.users = [];
  res.send(200);
});

/**
 * GET pet :id.
 */

app.get('/pets/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  res.send(pet);
});

/**
 * POST to create a new pet.
 */

app.post('/pets', function(req, res){
  var pet = req.body;
  pet.id = db.pets.push(pet) - 1;
  res.send(pet);
});

/**
 * PUT to update pet :id.
 */

app.put('/pets/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  db.pets[pet.id] = req.body;
  res.send(200);
});

/**
 * DELETE pet :id.
 */

app.del('/pets/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  db.pets.splice(pet.id, 1);
  res.send(200);
});

// users

/**
 * DELETE all users.
 */

app.del('/users', function(req, res){
  db.users = [];
  res.send(200);
});

/**
 * GET all users.
 */

app.get('/users', function(req, res){
  var age_gte = parseInt(req.query.age_gte);
  if (age_gte) {
    res.send(db.users.filter(function(user){
      return user.age >= age_gte;
    }));
    return;
  }
  res.send(db.users);
});

/**
 * POST a new user.
 */

app.post('/users', function(req, res){
  var user = req.body;
  var id = db.users.push(user) - 1;
  user.id = id;
  res.send({ id: id });
});

app.listen(4000);
console.log('test server listening on port 4000');
