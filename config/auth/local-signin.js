const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("connect-flash");
const User = require("../../models/user");

const strategy = new LocalStrategy({
    passReqToCallback: true,
    usernameField: "account"
}, (req, username, password, done) => {
    User.findOne({
        account: {
            "$regex": username,
            "$options": "i"
        }
    }).then((user) => {
        if (!user) {
            return done(null, false, req.flash("info", "Sorry! The account is not found."));
        }
        const isValid = bcrypt.compareSync(password, user.password);

        if (isValid) {
            return done(null, user);
        }
        return done(null, false, req.flash("info", "Oops! The password is wrong. Please try again!"));
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
    passport.use("local-signin", strategy);
};