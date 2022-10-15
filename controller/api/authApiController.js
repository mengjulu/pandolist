const User = require("../../models/user");
const bcrypt = require("bcryptjs");
require("../../config/auth/passport");
require("dotenv").config();

exports.signout = (req, res, next) => {
    try {
        req.logout();
        req.session.destroy();
        res.redirect("/");
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.auth = (req, res, next) => {
    try {
        req.isAuthenticated() ?
            next() : res.redirect("/");

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const saltRounds = 10;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const newPasswordCheck = req.body.newPasswordCheck;

        const checkOldPassword = await bcrypt.compareSync(oldPassword, user.password);
        if (!checkOldPassword) {
            res.status(401).json({
                resultMessage: "Current password does not match. Please try again!"
            });
        } else if (oldPassword === newPassword) {
            res.status(401).json({
                resultMessage: "Your new password is the same as current password."
            });
        } else if (newPassword != newPasswordCheck) {
            res.status(401).json({
                resultMessage: "Your new password confirmation is not correct. Please try again!"
            });
        } else {
            const password = await bcrypt.hash(newPassword, saltRounds);
            user.password = password;
            await user.save();

            res.status(200).json({
                resultMessage: "Password changed successfully!"
            });
        }

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};