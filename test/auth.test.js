const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authController = require("../controller/page/authController");
const authApiController = require("../controller/api/authApiController");
let req;
let res;
let password;

describe("auth", () => {

    before(() => {
        sinon.stub(bcrypt, "hash");
        password = sinon.stub(bcrypt, "compareSync");
        sinon.stub(User, "findById").returns({
            password: "test",
            save: () => {}
        });
    });

    it("should return sign up page elements and status 200", () => {
        req = {
            flash: (info) => {
                return info
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

        authController.getsignupPage(req, res);
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("auth/sign-up");
        expect(res.obj).to.deep.equal({ title: "Pandolist: Sign up", message: "info"});
    });

    it("should return sign in page elements and status 200", () => {
        req = {
            flash: (info) => {
                return info
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

        authController.getsigninPage(req, res);
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("auth/sign-in");
        expect(res.obj).to.deep.equal({ title: "Pandolist: Sign in", message: "info"});
    });

    it("should return `Current password does not match. Please try again!` with status 401", async () => {
        req = {
            user: {
                _id: ""
            },
            body: {
                oldPassword: "",
                newPassword: "",
                newPasswordCheck: ""
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

        password.returns(false);

        await authApiController.changePassword(req, res, () => {});
        expect(res.statusCode).to.equal(401);
        expect(res.json.resultMessage).to.equal("Current password does not match. Please try again!");
    });

    it("should return `Your new password is the same as current password.` with status 401", async () => {
        req = {
            user: {
                _id: ""
            },
            body: {
                oldPassword: "samepassword",
                newPassword: "samepassword",
                newPasswordCheck: ""
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

        password.returns(true);

        await authApiController.changePassword(req, res, () => {})
        expect(res.statusCode).to.equal(401);
        expect(res.json.resultMessage).to.equal("Your new password is the same as current password.");
    });

    it("should return `Your new password confirmation is not correct. Please try again!` with status 401", async () => {
        req = {
            user: {
                _id: ""
            },
            body: {
                oldPassword: "oldPassword",
                newPassword: "newPassword",
                newPasswordCheck: "notNewPassword"
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

        password.returns(true);

        await authApiController.changePassword(req, res, () => {})
        expect(res.statusCode).to.equal(401);
        expect(res.json.resultMessage).to.equal("Your new password confirmation is not correct. Please try again!");
    });


    it("should change password and return `Password changed successfully!` with status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            body: {
                oldPassword: "oldPassword",
                newPassword: "newPassword",
                newPasswordCheck: "newPassword"
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
        password.returns(true);
        
        await authApiController.changePassword(req, res, () => {})
        expect(res.statusCode).to.equal(200);
        expect(res.json.resultMessage).to.equal("Password changed successfully!");
    });

    after(() => {
        User.findById.restore();
        bcrypt.hash.restore();
        bcrypt.compareSync.restore();
    });
});