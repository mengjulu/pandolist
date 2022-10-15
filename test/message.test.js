const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../models/user");
const Message = require("../models/message");
const messageApiController = require("../controller/api/messageApiController");
let req;
let res;

describe("message", () => {

    before(() => {
        sinon.stub(Message.prototype, "save").returns("test");
        sinon.stub(User, "findById").returns({
            user: "test"
        });
    });
    it("should create message and return status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            body: {
                projectId: "",
                newMessage: ""
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

        await messageApiController.createMessage(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.newMessage).to.equal("test");
        expect(res.json.user).to.deep.equal({
            user: "test"
        });
    });

    after(() => {
        User.findById.restore();
        Message.prototype.save.restore();
    });
});