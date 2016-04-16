var express = require('express');
var app = express();
app.use(express.static('public'));

//=========MODEL=========

var model = require('./model');


//=========Routing=========

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});