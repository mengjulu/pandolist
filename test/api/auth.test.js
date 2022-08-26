const expect = require("chai").expect;
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const authApiController = require("../../controller/api/authApiController");

let user;
let req;
let res;

describe("auth", () => {

    before(async () => {
        //set test user data
        user = await new User({
            account: "AUTH-TEST@com",
            password: await bcrypt.hash("AUTH-TEST", 10),
            name: "AUTH-TEST"
        }).save();
    });

    it("should return `Current password does not match. Please try again!` with status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                oldPassword: "AUTH-TEST-NOT-MATCH",
                newPassword: "AUTH-TEST-CHANGE-PWD",
                newPasswordCheck: "AUTH-TEST-CHANGE-PWD"
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
        authApiController.changePassword(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("resultMessage", "Current password does not match. Please try again!");
                done();
            })
    });

    it("should return `Your new password is the same as current password.` with status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                oldPassword: "AUTH-TEST",
                newPassword: "AUTH-TEST",
                newPasswordCheck: "AUTH-TEST"
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
        authApiController.changePassword(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("resultMessage", "Your new password is the same as current password.");
            })
            .then(done, done);
    });

    it("should return `Your new password confirmation is not correct. Please try again!` with status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                oldPassword: "AUTH-TEST",
                newPassword: "AUTH-TEST-CHANGE-PWD",
                newPasswordCheck: "AUTH-TEST-CHANGE"
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
        authApiController.changePassword(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("resultMessage", "Your new password confirmation is not correct. Please try again!");
            })
            .then(done, done);
    });


    it("should change password and return `Password changed successfully!` with status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                oldPassword: "AUTH-TEST",
                newPassword: "AUTH-TEST-CHANGE-PWD",
                newPasswordCheck: "AUTH-TEST-CHANGE-PWD"
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
        authApiController.changePassword(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("resultMessage", "Password changed successfully!");
                done();
            })
    });

});