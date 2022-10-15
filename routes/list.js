const express = require("express");
const router = express.Router();
const listApiController = require("../controller/api/listApiController");
const listController = require("../controller/page/listController");
const authApiController = require("../controller/api/authApiController");
const csrf = require("csurf");
const csrfProtection = csrf({
    cookie: false
});

router.route("/:projectnum")
    .get(authApiController.auth, csrfProtection, listController.listpage)
    .post(authApiController.auth, csrfProtection, listApiController.addList);

router.route("/:listId")
.patch(authApiController.auth, csrfProtection, listApiController.checkList)
.put(authApiController.auth, csrfProtection, listApiController.setDueDate);

router.route("/:projectnum/:listId")
    .patch(authApiController.auth, csrfProtection, listApiController.editList)
    .delete(authApiController.auth, csrfProtection, listApiController.deleteList);

module.exports = router;