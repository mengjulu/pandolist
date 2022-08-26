const express = require("express");
const router = express.Router();
const projectApiController = require("../controller/api/projectApiController");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });

router.route("/project")
.post(projectApiController.addProject)
.delete(csrfProtection, projectApiController.deleteProject);

router.route("/project/auth")
.post(csrfProtection, projectApiController.addProjectAuth)
.delete(csrfProtection, projectApiController.removeProjectAuth);

router.patch("/project/title", csrfProtection, projectApiController.changeTitle);

module.exports = router;