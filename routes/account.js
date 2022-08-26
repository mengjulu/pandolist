const express = require("express");
const router = express.Router();
const accountController = require("../controller/page/accountController");
const accountApiController = require("../controller/api/accountApiController");
const authApiController = require("../controller/api/authApiController");
const multer = require("multer");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error("Allowed only png/jpeg"));}
    }
});

router.get("/settings", authApiController.auth, csrfProtection, accountController.getSettingsPage);
router.get("/password", authApiController.auth, csrfProtection, accountController.getPasswordPage);
router.patch("/profile/name", csrfProtection, accountApiController.editUserName);
router.post("/profile/avatar", upload.single("avatar"), accountApiController.uploadAvatar);

module.exports = router;