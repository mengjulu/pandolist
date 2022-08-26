const expect = require("chai").expect;
const sinon = require("sinon");
const reminderApiController = require("../../controller/api/reminderApiController");
const User = require("../../models/user");
const List = require("../../models/list");
const Project = require("../../models/project");
const lineReminder = require("../../config/helper/line-reminder");
const googleReminder = require("../../config/helper/google-reminder");

let user;
let project;
let list;
let req;
let res;

describe("reminder", function(){

    before(async () => {
        //set test user data
        user = await new User({
            account: "REMINDER-TEST@com",
            password: "REMINDER-TEST",
            name: "REMINDER-TEST"
        }).save();

        //set test project data
        project = await new Project({
            name: "REMINDER-TEST: Project",
            creator: user._id,
            num: Math.floor(Date.now() * Math.random())
        }).save();

        project.addAuth(user);

        //set test list data
        list = await new List({
            project: project._id,
            content: "REMINDER-TEST: List",
            creator: user._id,
            start: "2038-01-19",
            end: "2038-01-19"
        }).save();

        project.addListId(list._id);

        sinon.stub(lineReminder, "lineNotifyStatus").callsFake(() => {
            return ({
                statusCode: 200
            });
        });
        sinon.stub(lineReminder, "lineNotifyAuth").callsFake(() => {});
        sinon.stub(lineReminder, "lineNotifyAdd").callsFake(() => {});
        sinon.stub(googleReminder, "googleCalendarInsert").callsFake(() => {
            return {
                statusCode: 200,
                authUrl: null
              }
        })

    });

    it("should set line notification and return scheduleStatus `true` and status 200", (done) => {
        req = {
            params: {
                listid: list._id
            },
            user: {
                _id: user._id
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
        reminderApiController.lineNotify(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("scheduleStatus", true);
                done();
            }).catch(done);
    });
    
    it("should cancel line notification and return scheduleStatus `false` and status 200", (done) => {
        req = {
            params: {
                listid: list._id
            },
            user: {
                _id: user._id
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

        sinon.stub(lineReminder, "scheduleCheck").returns(true);

        reminderApiController.lineNotify(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("scheduleStatus", false);

                done();
            }).catch(done);
    });

    it("should add list to google calendar and return object `statusCode` 200 and status 200", (done) => {
        req = {
            params: {
                listid: list._id
            },
            user: {
                _id: user._id
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

        reminderApiController.googleCalendar(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("statusCode", 200);
                expect(res.json).to.have.property("authUrl", null);

                done();
            }).catch(done);
    });

    after(() => {
        lineReminder.lineNotifyStatus.restore();
        lineReminder.lineNotifyAuth.restore();
        lineReminder.lineNotifyAdd.restore();
        lineReminder.scheduleCheck.restore();
        googleReminder.googleCalendarInsert.restore();
    })
});