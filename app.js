var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


// mongodb://<dbuser>:<dbpassword>@ds011251.mlab.com:11251/treeify
// dbuser: treeify
// dbpassword: treeify