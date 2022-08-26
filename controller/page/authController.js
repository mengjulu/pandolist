require("../../config/auth/passport");
require("dotenv").config();

exports.getsignupPage = (req, res) => {
    res.status(200).render("auth/sign-up", {
        title: "Pandolist: Sign up",
        message: req.flash("info")
    })
};

exports.getsigninPage = (req, res) => {
    res.status(200).render("auth/sign-in", {
        title: "Pandolist: Sign in",
        message: req.flash("info")
    })
};