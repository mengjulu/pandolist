const expect = require("chai").expect;
const User = require("../../models/user");
const Project = require("../../models/project");
const messageApiController = require("../../controller/api/messageApiController");

let user;
let project;
let req;
let res;

describe("message", () => {

    before(async () => {
        //set test user data
        user = await new User({
            account: "MESSAGE-TEST@com",
            password: "MESSAGE-TEST",
            name: "MESSAGE-TEST"
        }).save();

        //set test project data
        project = await new Project({
            name: "MESSAGE-TEST: Project",
            creator: user._id,
            num: Math.floor(Date.now() * Math.random())
        }).save();

        project.addAuth(user);
    });

    it("should create message and return status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                projectId: project._id,
                newMessage: "MESSAGE TEST: Create message"
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

        messageApiController.createMessage(req, res, () => {})
            .then(() => {
                
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("newMessage");
                expect(res.json).to.have.property("user");
                expect(res.json.newMessage.content).to.equal("MESSAGE TEST: Create message");

                done();
            }) 
    });
});