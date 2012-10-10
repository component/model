
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express();

// middleware

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/..'));

// faux db

var db = { pets: [] };

// routes

/**
 * DELETE everythinggggg.
 */

app.del('/', function(req, res){
  db.pets = [];
  res.send(200);
});

/**
 * GET pet :id.
 */

app.get('/pet/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  res.send(pet);
});

/**
 * POST to create a new pet.
 */

app.post('/pet', function(req, res){
  var pet = req.body;
  pet.id = db.pets.push(pet) - 1;
  res.send(pet);
});

/**
 * PUT to update pet :id.
 */

app.put('/pet/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  db.pets[pet.id] = req.body;
  res.send(200);
});

/**
 * DELETE pet :id.
 */

app.del('/pet/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  db.pets.splice(pet.id, 1);
  res.send(200);
});

app.listen(3000);
console.log('test server listening on port 3000');