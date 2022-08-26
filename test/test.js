const mongoose = require("mongoose");
const User = require("../models/user");
const List = require("../models/list");
const Project = require("../models/project");
const Message = require("../models/message");

describe("api test", () => {
    before(async () => {
        await mongoose.connect("mongodb://localhost:27017/testDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    });

    require("./api/account.test");
    require("./api/auth.test");
    require("./api/index.test");
    require("./api/list.test");
    require("./api/message.test");
    require("./api/project.test");
    require("./api/reminder.test");

    after(async () => {
            await Project.deleteMany();
            await User.deleteMany();
            await List.deleteMany();
            await Message.deleteMany();
            await mongoose.disconnect();
        }
    )
});

describe("page test", () => {
    require("./page/auth.page.test");
    require("./page/account.page.test");
    require("./page/index.page.test");
    require("./page/list.page.test");
})