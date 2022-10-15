const User = require("../../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("connect-flash");
const {validationResult} = require("express-validator");
const {davatar} = require("davatar");
const exampleProject = require("./exampleProject");

const strategy = new LocalStrategy({
        passReqToCallback: true,
        usernameField: "account"
    },
    async (req, username, password, done) => {
        const isEmailError = validationResult(req).array()[0];
        if(isEmailError) {
            return done(null, false, req.flash("info", isEmailError.msg));
        }
        const saltRounds = 10;
        const name = req.body.name;
        const hashPassword = bcrypt.hashSync(password, saltRounds);
        const originAvatar = await davatar.generate({
            size: 100,
            text: username.toLowerCase(),
            textColor: "white",
            backgroundColor: "black",
            fontFamily: "Courier New",
            fontWeight: 650
        });

        const newUser = await new User({
            account: username.toLowerCase(),
            password: hashPassword,
            name: name,
            avatar: {
                avatarPhoto: originAvatar
              }
        });
        User.findOne({
            account: {
                "$regex": username.toLowerCase(),
                "$options": "i"
            }
        }).then(async (existUser) => {
            if (existUser) {
                return done(null, false, req.flash("info", "The account has already existed, please try again!"));
            } else {
                await exampleProject(newUser);
                return done(null, newUser);
            }
        })
        .catch((err) => {
            console.log(err)
        });
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
    passport.use("local-signup", strategy);
};