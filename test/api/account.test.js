const expect = require("chai").expect;
const accountApiController = require("../../controller/api/accountApiController");
const User = require("../../models/user");
const fs = require("fs");

let user;
let req;
let res;

describe("account", function () {
    this.timeout(15000);

    before(async () => {
        //set test user data
        user = await new User({
            account: "ACCOUNT-TEST@com",
            password: "ACCOUNT-TEST",
            name: "ACCOUNT-TEST"
        }).save();
    });

    it("should edit name and return status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                newUserName: "ACCOUNT-TEST-EDIT"
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
        };
        accountApiController.editUserName(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("editNameStatus", true);
                expect(res.json).to.have.property("newUserName", "ACCOUNT-TEST-EDIT");

                done();
            });
    });

    it("should upload avatar and return status 200", (done) => {

        req = {
            user: {
                _id: user._id
            },
            file: {
                buffer: fs.readFileSync("public/image/test.png", (err, data) => {
                    if (err) console.log(err);
                    else return data;
                })
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

        accountApiController.uploadAvatar(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("avatarPhoto");
            }).then(done, done);
    });
});

