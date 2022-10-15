const User = require("../../models/user");
const List = require("../../models/list");
const FormData = require("form-data");
const lineReminder = require("../../utils/line-reminder");
const googleReminder = require("../../utils/google-reminder");
require("dotenv").config();

exports.lineNotify = async (req, res, next) => {
    try {
        const listId = req.params.listid;
        const userId = req.user._id;
        const eventId = userId + listId;
        const currentUser = await User.findById(userId);
        const access = currentUser.lineAccessToken;
        const currentList = await List.findById(listId);
        const listContent = currentList.content;
        const date = new Date(currentList.end);
        const formData = new FormData();
        formData.append("message", `\n Task Due Today ⏰ \n ${listContent}`);
        const headers = {
            'Authorization': `Bearer ${access}`,
            ...formData.getHeaders()
        };
        const lineAuthCheck = await lineReminder.lineNotifyStatus(headers);
        const scheduleCheck = await lineReminder.scheduleCheck(eventId);
        //if the schedule exists, cancel it.
        if (scheduleCheck) {
            await lineReminder.lineNotifyCancel(eventId);
            res.status(200).json({
                scheduleStatus: false
            });
            //if the reminder passed, then show error message(frontend).
        } else if (currentList.end < new Date()) {
            res.status(200).json({
                scheduleStatus: `invalid`
            });
        } else {
            //if auth status returns 200, then create a new schedule.
            if (lineAuthCheck.statusCode === 200) {
                await lineReminder.lineNotifyAdd(eventId, headers, date, formData);
                res.status(200).json({
                    scheduleStatus: true
                })
            } else {
                //if auth status returns 401, then redirect to auth url(frontend).
                //if status returns other code, then show error message(frontend).
                res.json(lineAuthCheck)
            }
        }
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.lineNotifyAuthCallback = async (req, res, next) => {
    try {
        const code = req.query.code;
        const userId = req.user._id;
        await lineReminder.lineNotifyAuth(code, userId);
        res.redirect("/");

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

// google
exports.googleCalendar = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id);
        const token = user.googleRefreshToken;
        const listid = req.params.listid;
        const currentList = await List.findById(listid);
        const listContent = currentList.content;
        const listDueDate = currentList.end;
        const date = new Date(listDueDate).toISOString().slice(0, 10);

        if (listDueDate < new Date()) {
            //check if today is before the due date
            res.status(200).json({
                statusCode: `invalid`
            });
        } else {
            const insertGoogleReminder = await googleReminder.googleCalendarInsert(token, date, listContent);
            res.status(200).json(insertGoogleReminder);
        }
    } catch (err) {
        console.log(err)
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    };
};

exports.googleCalendarCallback = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const code = req.query.code;
        await googleReminder.googleCalendarAuth(user, code);
        res.redirect("/");

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};