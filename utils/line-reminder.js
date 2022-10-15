const axios = require("axios");
const schedule = require("node-schedule");
const User = require("../models/user");
const lineID = process.env.LINE_NOTIFY_ID;
const lineSecret = process.env.LINE_NOTIFY_SECRET;
const lineCallback = process.env.LINE_NOTIFY_CALLBACK_URL;
require("dotenv").config();

exports.lineNotifyStatus = async (headers) => {
    const authUrl = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${lineID}&redirect_uri=${lineCallback}&scope=notify&state=state`
    let statusCode;

    await axios({
            method: "get",
            url: "https://notify-api.line.me/api/status",
            headers: headers
        })
        .then(res => {
            statusCode = res.data.status;
        })
        .catch(err => {
            statusCode = err.response.status;
        });
    return ({
        statusCode: statusCode,
        authUrl: statusCode === 401 ? authUrl : null
    });
};

exports.lineNotifyAuth = (code, userId) => {
    axios.post(`https://notify-bot.line.me/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${lineCallback}&client_id=${lineID}&client_secret=${lineSecret}`)
        .then(async res => {
            const access = res.data.access_token;
            const user = await User.findById(userId);
            user.lineAccessToken = access;
            await user.save();
        }).catch(err => {
            console.log(err)
        });
};

exports.lineNotifyAdd = (eventId, headers, date, bodyFormData) => {
    schedule.scheduleJob(eventId, date, () => {
        axios({
                method: "post",
                url: "https://notify-api.line.me/api/notify",
                headers: headers,
                data: bodyFormData
            })
            .catch(err => {
                console.log(err)
            })
    });
};

exports.lineNotifyCancel = (eventId) => {
    schedule.cancelJob(eventId);
};

exports.scheduleCheck = (eventId) => {
    return schedule.scheduledJobs[eventId] ? true : false;
};