const express = require("express");
const router = express.Router();
const messageApiController = require("../controller/api/messageApiController");

router.post("/create/message", messageApiController.createMessage);

module.exports = router;