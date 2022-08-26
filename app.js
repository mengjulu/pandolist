const express = require("express");
const app = express();
const ejs = require("ejs");
const cors = require("cors");
require("./config/mongoose");
const passport = require("./config/auth/passport");
const server = app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Log in successfully.")
});
const io = require("socket.io")(server);

//configuration
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.json());
app.use("/static", express.static("public"));
app.set("view engine", "ejs");
app.use(passport);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

//routes setting
const indexRoute = require("./routes/index");
const listRoute = require("./routes/list");
const authRoute = require("./routes/auth");
const projectRoute = require("./routes/project");
const reminderRoute = require("./routes/reminder");
const messageRoute = require("./routes/message");
const accountRoute = require("./routes/account");
const errorController = require("./controller/page/errorController");

app.use(indexRoute);
app.use(listRoute);
app.use("/auth", authRoute);
app.use(projectRoute);
app.use(reminderRoute);
app.use(messageRoute);
app.use("/account", accountRoute);

//socket connection
const socketConfig = require("./config/socket");
io.on("connection", socketConfig);

//error handling
app.use((error, req, res) => {
    console.log(error)
    const status = error.status || 500;
   return res.redirect("/error");
});
app.get("/error", errorController.serverError);
app.get("*", errorController.pageNotFoundError);

module.exports = app;