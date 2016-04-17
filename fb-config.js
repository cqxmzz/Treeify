var services = require('./services');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var facebook_api_key = "1551885705104769";
var facebook_api_secret = "501b8cc8691865605c4a96cb79b6aed5";
var callback_url = "http://localhost/auth/facebook/callback";
var use_database = "false";

exports.registerStratergy = function(models, services) {
  passport.use(new FacebookStrategy({
      clientID: facebook_api_key,
      clientSecret: facebook_api_secret,
      callbackURL: callback_url,
      profileFields: ['displayName', 'picture', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        
        console.log(profile._json.name);
        console.log(profile._json.picture.data.url);
        console.log(profile._json.email);
        return done(null, profile);
      });
    }
  ));
}

exports.passport = passport;