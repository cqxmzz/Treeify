var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//=========MODELS=========

var models = require('./models');

//=========SERVICES=========

var services = require('./services');

//=========FB-CONFIG=========

var fb_config = require('./fb-config');
var passport = fb_config.passport;
fb_config.registerStratergy(models, services);

//=========MIDDLEWARE=========

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static('public'));

//=========Routing=========

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       /* successRedirect : '/', */
       failureRedirect: '/',
       session: false,
       authType: 'rerequest',
       display: 'popup'
  }),
  function(req, res) {
    res.redirect('/after-auth.html');
  }
);

app.get('/login', function(req, res) {
  var name = 'Qiming Chen';
  var email = 'simoncqm@gmail.com';
  services.getLogin(models.Users, models.Sessions, name, email, function(data) {
    res.send(data);
  });
});

app.get('/logout', function (req, res) {
  // TODO
});

app.get('/top-users', function(req, res) {
  services.getTopUsers(models.Users, function(data) {
    res.send(data);
  });
});

app.get('/trees', function(req, res) {
  services.getTrees(models.Trees, models.Types, function(data) {
    res.send(data);
  });
});

app.get('/trees/mine', function(req, res) {
  var user_id = '5712a546e4b065a8c4d713c6';
  services.getTreesForUser(models.Users, models.Trees, models.Types, user_id, function(data) {
    res.send(data);
  });
});

app.get('/types', function(req, res) {
  services.getTypes(models.Types, function(data) {
    res.send(data);
  });
});

app.get('/profile', function(req, res) {
  var user_id = '5712a546e4b065a8c4d713c6';
  services.getProfile(models.Users, user_id, function(data) {
    res.send(data);
  });
});

app.post('/plant', function(req, res) {
  console.log(req);
  var user_id = '5712a546e4b065a8c4d713c6';
  services.plantTree(models.Trees, models.Users, req, user_id);
});

app.listen(80, function () {
  console.log('Treeify app listening on port 80!');
});