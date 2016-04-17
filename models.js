//=========DB=========

var mongoose = require('mongoose');
mongoose.connect('mongodb://treeify:treeify@ds011251.mlab.com:11251/treeify');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoose!');
});

//=========SCHEMAS=========

var sessionsSchema = mongoose.Schema({
  u_id: String
});

var treesSchema = mongoose.Schema({
  type: String,
  location: {
    x: Number,
    y: Number
  },
  plant_time: Number
});

var typesSchema = mongoose.Schema({
  name: String,
  o2_rate: Number,
  growth_rate: Number,
  life_span: Number
});

var usersSchema = mongoose.Schema({
  name: String,
  email: String,
  type: Number,
  trees: [String]
});

//=========MODELS=========

var Sessions = mongoose.model('Sessions', sessionsSchema);
var Trees = mongoose.model('Trees', treesSchema);
var Types = mongoose.model('Types', typesSchema);
var Users = mongoose.model('Users', usersSchema);

//=========EXPORT=========

exports.Sessions = Sessions;
exports.Trees = Trees;
exports.Types = Types;
exports.Users = Users;

//=========LOGGING=========

// Sessions.find(function (err, sessions) {
//   if (err) 
//     return console.error(err);
//   console.log();
//   console.log("Sessions:");
//   console.log(sessions);
// })

// Trees.find(function (err, trees) {
//   if (err) 
//     return console.error(err);
//   console.log();
//   console.log("Trees:");
//   console.log(trees);
// })

// Types.find(function (err, types) {
//   if (err) 
//     return console.error(err);
//   console.log();
//   console.log("Types:");
//   console.log(types);
// })

// Users.find(function (err, users) {
//   if (err) 
//     return console.error(err);
//   console.log();
//   console.log("Users:");
//   console.log(users);
// })

