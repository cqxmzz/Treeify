var express = require('express');
var app = express();
app.use(express.static('public'));

//=========MODELS=========

var models = require('./models');

//=========SERVICES=========

var services = require('./services');

//=========Routing=========

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/trees', function(req, res) {
  var cob = function (data) {
  	res.send(data);
  }
  services.getTrees(models.Trees, models.Types, cob);
});

app.get('/types', function(req, res) {
  var cob = function (data) {
    res.send(data);
  }
  services.getTypes(models.Types, cob);
});

app.get('/users', function(req, res) {
  var cob = function (data) {
    res.send(data);
  }
  services.getUsers(models.Users, cob);
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});