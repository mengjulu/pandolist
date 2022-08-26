const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../config/helper/validator");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });
const authController = require("../controller/page/authController");
const authApiController = require("../controller/api/authApiController");
require("../config/auth/google-auth")(passport);
require("../config/auth/local-signin")(passport);
require("../config/auth/local-signup")(passport);

router.route("/sign-up")
  .get(authController.getsignupPage)
  .post(
  validator.signupInfo,
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/auth/sign-up",
    failureFlash: true
  }));

router.route("/sign-in")
  .get(authController.getsigninPage)
  .post(passport.authenticate("local-signin", {
    successRedirect: "/",
    failureRedirect: "/auth/sign-in",
    failureFlash: true
  }));

router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline"
  })
);
router.get("/google/pandolist",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/sign-up"
  })
);

router.get("/sign-out", authApiController.signout);
router.patch("/change/password", csrfProtection, authApiController.changePassword);

module.exports = router;