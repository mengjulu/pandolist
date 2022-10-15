const express = require("express");
const router = express.Router();
const projectApiController = require("../controller/api/projectApiController");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });

router.route("/")
.post(projectApiController.addProject)
.patch(csrfProtection, projectApiController.changeTitle)
.delete(csrfProtection, projectApiController.deleteProject);

router.route("/auth")
.post(csrfProtection, projectApiController.addProjectAuth)
.delete(csrfProtection, projectApiController.removeProjectAuth);

module.exports = router;