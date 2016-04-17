var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

app.post('/plant', function(req, res) {
  console.log(req);
  var user_id = '5712a546e4b065a8c4d713c6';
  services.plantTree(models.Trees, models.Users, req, user_id);
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});