const expect = require("chai").expect;
const sinon = require("sinon");
const reminderApiController = require("../controller/api/reminderApiController");
const User = require("../models/user");
const List = require("../models/list");
const Project = require("../models/project");
const FormData = require("form-data");
const lineReminder = require("../utils/line-reminder");
const googleReminder = require("../utils/google-reminder");

let user;
let project;
let list;
let req;
let res;
let lineStatus;
let lineAuth;
let lineAdd;
let googleInsert;

describe("reminder", () => {

    before(() => {
        user = sinon.stub(User, "findById");
        list = sinon.stub(List, "findById");
        sinon.stub(FormData.prototype, "append");
        sinon.stub(FormData.prototype, "getHeaders");

        lineStatus = sinon.stub(lineReminder, "lineNotifyStatus");
        lineAuth = sinon.stub(lineReminder, "lineNotifyAuth");
        lineAdd = sinon.stub(lineReminder, "lineNotifyAdd");
        scheduleCheck = sinon.stub(lineReminder, "scheduleCheck");
        googleInsert = sinon.stub(googleReminder, "googleCalendarInsert");

    });

    it("should cancel line notification and return scheduleStatus `false` and status 200", async () => {
        req = {
            params: {
                listid: ""
            },
            user: {
                _id: ""
            }
        }
        res = {
            json: function (json) {
                this.json = json;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        }
        scheduleCheck.returns(true);
        user.returns({
            lineAccessToken: "",
        });

        list.returns({
            content: "",
            end: new Date() + 1
        })

        lineStatus.returns({
            statusCode: 200
        });

        await reminderApiController.lineNotify(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.scheduleStatus).to.be.false;
    });

    it("should cancel line notification and return scheduleStatus `invalid` and status 200", async () => {
        req = {
            params: {
                listid: ""
            },
            user: {
                _id: ""
            }
        }
        res = {
            json: function (json) {
                this.json = json;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        }
        scheduleCheck.returns(false);
        user.returns({
            lineAccessToken: "",
        });

        list.returns({
            content: "",
            end: new Date() - 1
        })

        lineStatus.returns({
            statusCode: 200
        });

        await reminderApiController.lineNotify(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.scheduleStatus).to.equal("invalid");
    });

    it("should set line notification and return scheduleStatus `true` and status 200", async () => {
        req = {
            params: {
                listid: ""
            },
            user: {
                _id: ""
            }
        }
        res = {
            json: function (json) {
                this.json = json;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        }
        user.returns({
            lineAccessToken: "",
        });

        list.returns({
            content: "",
            end: new Date() + 1
        })

        lineStatus.returns({
            statusCode: 200
        });

        await reminderApiController.lineNotify(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.scheduleStatus).to.be.true;
    });

    it("should send auth url to user in order to authorize line permission", async () => {
        req = {
            params: {
                listid: ""
            },
            user: {
                _id: ""
            }
        }
        res = {
            json: function (json) {
                this.json = json;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        }
        user.returns({
            lineAccessToken: "",
        });

        list.returns({
            content: "",
            end: new Date() + 1
        })

        lineStatus.returns({
            statusCode: 401,
            authUrl: "test"
        });

        await reminderApiController.lineNotify(req, res, () => {});
        expect(res.json.statusCode).to.equal(401);
        expect(res.json.authUrl).to.equal("test");
    });

    it("should add list to google calendar and return object `statusCode` 200", async () => {
        req = {
            params: {
                listid: ""
            },
            user: {
                _id: ""
            }
        };
        res = {
            json: function (json) {
                this.json = json;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        };

        user.returns({
            googleRefreshToken: "",
        });

        list.returns({
            content: "",
            end: new Date() + 1
        })
        googleInsert.returns({
            statusCode: 200,
            authUrl: null
        });

        await reminderApiController.googleCalendar(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.statusCode).to.equal(200);
        expect(res.json.authUrl).to.be.a("null");
    });

    it("should add list to google calendar and return object `statusCode: invalid`", async () => {
        req = {
            params: {
                listid: ""
            },
            user: {
                _id: ""
            }
        };
        res = {
            json: function (json) {
                this.json = json;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        };

        user.returns({
            googleRefreshToken: "",
        });

        list.returns({
            content: "",
            end: new Date() - 1
        })

        await reminderApiController.googleCalendar(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.statusCode).to.equal("invalid");
    });

    after(() => {
        User.findById.restore();
        List.findById.restore();
        FormData.prototype.append.restore();
        FormData.prototype.getHeaders.restore();
        lineReminder.lineNotifyStatus.restore();
        lineReminder.lineNotifyAuth.restore();
        lineReminder.lineNotifyAdd.restore();
        lineReminder.scheduleCheck.restore();
        googleReminder.googleCalendarInsert.restore();
    })
});