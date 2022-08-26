const { check } = require("express-validator");

module.exports = {
    signupInfo: [
        check("account").isEmail()
        .withMessage("Please enter a valid email address.")
        .custom((value) => {
            if (value === "test@test.com") {
                throw Error("This email address is forbidden.")
            }
        }),
        check("password").isLength({
            min: 4
        })
        .withMessage("The password should more than 4 characters.")
        .trim().escape(),
        check("name").isLength({
            min: 2
        })
        .withMessage("The name should more than 2 characters.")
        .trim().escape()
    ]
};