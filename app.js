var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});


// mongodb://<dbuser>:<dbpassword>@ds011251.mlab.com:11251/treeify
// dbuser: treeify
// dbpassword: treeify