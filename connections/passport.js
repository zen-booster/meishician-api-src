const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: "1002738967062-88hi9kkverpeecb353njp5bs2o34kjp9.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3001/auth/google/callback"
},
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile)
    return cb(null, profile);
  }
));