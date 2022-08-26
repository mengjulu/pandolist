const User = require("../../models/user");
require("dotenv").config();

exports.getSettingsPage = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("project");
        res.status(200).render("account/settings", {
            title: "Settings",
            offCanvasProject: user.project,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getPasswordPage = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("project");

        res.status(200).render("account/password", {
            title: "Change password",
            offCanvasProject: user.project,
            csrfToken: req.csrfToken()
        });

    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 400;
        return next(error);
    }
};
