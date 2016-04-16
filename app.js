var express = require('express');
var app = express();
app.use(express.static('public'));

//=========DB=========

var mongoose = require('mongoose');
mongoose.connect('mongodb://treeify:treeify@ds011251.mlab.com:11251/treeify');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoose!');
   var createSchema = require('./schema');
   createSchema(mongoose);
});

//=========Routing=========

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});