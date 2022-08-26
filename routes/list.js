const express = require("express");
const router = express.Router();
const listApiController = require("../controller/api/listApiController");
const listController = require("../controller/page/listController");
const authApiController = require("../controller/api/authApiController");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });

router.get("/list/:projectnum", authApiController.auth, csrfProtection, listController.listpage);

router.post("/add/list/:projectnum", authApiController.auth, csrfProtection, listApiController.addList);

router.patch("/edit/list/:projectnum/:listId", authApiController.auth, csrfProtection, listApiController.editList);
router.patch("/check/list/:projectnum/:listId", authApiController.auth, csrfProtection, listApiController.checkList);
router.patch("/setdate/list/:listId", authApiController.auth, csrfProtection, listApiController.setDueDate);

router.delete("/delete/list/:projectnum/:listId", authApiController.auth, csrfProtection, listApiController.deleteList);

module.exports = router;