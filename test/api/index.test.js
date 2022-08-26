const expect = require("chai").expect;
const User = require("../../models/user");
const indexApiController = require("../../controller/api/indexApiController");

let user;
let req;
let res;

describe("index", () => {
    before(async () => {
        //set test user data
        user = await new User({
                account: "INDEX-TEST@com",
                password: "INDEX-TEST",
                name: "INDEX-TEST"
            })
            .save();

        req = {
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
    });

    it("should return all undone lists and status 200", (done) => {

        indexApiController.mylist(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("allUndoneLists");
                done();
            })
    })
});