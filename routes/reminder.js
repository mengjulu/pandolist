const express = require("express");
const router = express.Router();
const reminderApiController = require("../controller/api/reminderApiController");

//line reminder
router.get("/line-notify/callback", reminderApiController.lineNotifyAuthCallback);
router.get("/line-notify/:listid", reminderApiController.lineNotify);

//google reminder
router.get("/google/calendar/:listid", reminderApiController.googleCalendar);
router.get("/google/pandolist/calendar", reminderApiController.googleCalendarCallback);

module.exports = router;