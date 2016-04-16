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

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});