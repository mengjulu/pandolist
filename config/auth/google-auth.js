const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../../models/user");
const exampleProject = require("./exampleProject");
const {
  davatar
} = require("davatar");
require("dotenv").config();

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL
  },
 async (accessToken, refreshToken, profile, done) => {
    const originAvatar = await davatar.generate({
      size: 70,
      text: profile.emails[0].value,
      textColor: "white",
      backgroundColor: "black",
      fontFamily: "Courier New",
      fontWeight: 600
    });
    const newUser = await new User({
      account: profile.emails[0].value,
      name: profile.displayName,
      avatar: {
        avatarPhoto: originAvatar
      }
    });
    User.findOne({
      account: profile.emails[0].value
    }, async function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        exampleProject(newUser);
        return done(null, newUser);
      }
      return done(null, user);
    })
  });

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  passport.use(googleStrategy);
};