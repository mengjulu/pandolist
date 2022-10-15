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
const reminderRoute = require("./routes/reminder");
const messageRoute = require("./routes/message");
const listRoute = require("./routes/list");
const authRoute = require("./routes/auth");
const projectRoute = require("./routes/project");
const accountRoute = require("./routes/account");

app.use(indexRoute);
app.use(reminderRoute);
app.use(messageRoute);
app.use("/list", listRoute);
app.use("/auth", authRoute);
app.use("/project", projectRoute);
app.use("/account", accountRoute);

//socket connection
const socketConfig = require("./config/socket");
io.on("connection", socketConfig);

//error handling
const errorController = require("./controller/page/errorController");
app.use((error, req, res, next) => {
    console.log(error)
    res.redirect("/error");
});
app.get("/error", errorController.serverError);
app.get("*", errorController.pageNotFoundError);

module.exports = app;