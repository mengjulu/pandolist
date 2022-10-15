const google = require("googleapis").google;
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID_CALENDAR,
  process.env.GOOGLE_CLIENT_SECRET_CALENDAR,
  process.env.GOOGLE_CLIENT_SECRET_CALENDAR_URL
);
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar"]
});

exports.googleCalendarAuth = async (user, code) => {
  const {
    tokens
  } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  user.googleRefreshToken = tokens.refresh_token;
  await user.save();
};

exports.googleCalendarInsert = async (token, date, listContent) => {
  const newEvent = {
    "summary": listContent,
    "start": {
      "date": date
    },
    "end": {
      "date": date
    },
    "reminders": {
      "useDefault": false,
      "overrides": [{
        "method": "popup",
        "minutes": 0
      }]
    }
  };

  oauth2Client.setCredentials({
    refresh_token: `${token}`
  });
  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client
  });
  let statusCode;

  await calendar.events.insert({
      calendarId: "primary",
      resource: newEvent
    })
    .then(res => {
      statusCode = res.status;
    })
    .catch(err => {
      statusCode = err.response.status;
    });
  return ({
    statusCode: statusCode,
    authUrl: statusCode === 400 ? authUrl : null
  });
};