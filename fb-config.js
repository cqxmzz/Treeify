var services = require('./services');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var facebook_api_key = "1551885705104769";
var facebook_api_secret = "501b8cc8691865605c4a96cb79b6aed5";
var callback_url = "http://localhost/auth/facebook/callback";

exports.registerStratergy = function(models, services) {
  passport.use(new FacebookStrategy({
      clientID: facebook_api_key,
      clientSecret: facebook_api_secret,
      callbackURL: callback_url,
      profileFields: ['displayName', 'picture', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        services.getLogin(
            models.Users,
            models.Sessions,
            profile._json.name,
            profile._json.email ?
              profile._json.email :
              profile._json.id + "@facebook.com",
            profile._json.email ? "" : profile._json.picture.data.url,
            function(session_id) {
              console.log("session created: " + session_id);
              done(null, session_id);
            });
        // console.log(profile._json.picture.data.url);
      });
    }
  ));
}

passport.serializeUser(function(session_id, done) {
  console.log("serializing: " + session_id);
  done(null, session_id);
});

// used to deserialize the user
passport.deserializeUser(function(session_id, done) {
  console.log("de-serializing: " + session_id);
  done(null, session_id);
});

exports.passport = passport;