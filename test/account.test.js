const expect = require("chai").expect;
const accountController = require("../controller/page/accountController");
const accountApiController = require("../controller/api/accountApiController");
const sinon = require("sinon");
const User = require("../models/user");
const imgurClient = require("../config/imgur");
let user;
let req;
let res;


describe("account", () => {
    before(() => {
        user = sinon.stub(User, "findById");
        sinon.stub(imgurClient, "deleteImage");
        sinon.stub(imgurClient, "upload").returns({
            data: {
                link: "newLink",
                deleteHash: "newDeleteHash"
            }
        });
    });

    it("should return settings page elements and status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            csrfToken: () => {
                return "csrfToken"
            }
        };

        res = {
            render: function (view, obj) {
                this.view = view;
                this.obj = obj;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        };

        user.returns({
            populate: () => {
                return {
                    project: []
                };
            }
        })

        await accountController.getSettingsPage(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("account/settings");
        expect(res.obj).to.deep.equal({ title: "Settings", offCanvasProject: [], csrfToken: "csrfToken"});
    });

    it("should return change password page elements and status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            csrfToken: () => {
                return "csrfToken"
            }
        };

        res = {
            render: function (view, obj) {
                this.view = view;
                this.obj = obj;
                return this;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            }
        };

        user.returns({
            populate: () => {
                return {
                    project: []
                };
            }
        })

        await accountController.getPasswordPage(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("account/password");
        expect(res.obj).to.deep.equal({ title: "Change password", offCanvasProject: [], csrfToken: "csrfToken"});
    });

    it("should edit name and return status 200", async () => {
        const newUserName = "changetest";
        req = {
            user: {
                _id: ""
            },
            body: {
                newUserName: newUserName
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
            name: "",
            save: () => {
                return newUserName
            }
        })

        await accountApiController.editUserName(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.editNameStatus).to.be.true;
        expect(res.json.newUserName).to.equal(newUserName);
    });

    it("should upload avatar and return status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            file: {
                buffer: ""
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
            avatar: {
                avatarPhoto: "originLink",
                deleteHash: "originDeleteHash"
            },
            save: () => {}
        });
        await accountApiController.uploadAvatar(req, res, () => {});

        expect(res.statusCode).to.equal(200);
        expect(res.json.avatarPhoto).to.equal("newLink");
    });

    after(() => {
        User.findById.restore();
        imgurClient.deleteImage.restore();
        imgurClient.upload.restore();
    })
});