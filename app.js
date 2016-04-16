var express = require('express');
var app = express();
app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://treeify:treeify@ds011251.mlab.com:11251/treeify');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoose!');
});

var sessionsSchema = mongoose.Schema({
    _id: String,
    u_id: String
});

var treesSchema = mongoose.Schema({
    _id: String,
    type: String,
    location: {
		x: Number,
		y: Number
    },
    plant_time: Number
});

var typesSchema = mongoose.Schema({
    _id: String,
    name: String,
    o2rate: Number,
    growth_rate: Number,
    life_span: Number
});

var usersSchema = mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    type: Number,
    trees: [String]
});

var Users = mongoose.model('Users', treesSchema);
Users.find(function (err, users) {
  if (err) return console.error(err);
  console.log(users);
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});




// mongodb://<dbuser>:<dbpassword>@ds011251.mlab.com:11251/treeify
// dbuser: treeify
// dbpassword: treeify