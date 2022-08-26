const expect = require("chai").expect;
const User = require("../../models/user");
const Project = require("../../models/project");
const listApiController = require("../../controller/api/listApiController");

let user;
let project;
let list;
let req;
let res;

describe("list", () => {

    before(async () => {
        //set test user data
        user = await new User({
            account: "LIST-TEST@com",
            password: "LIST-TEST",
            name: "LIST-TEST"
        }).save();

        //set test project data
        project = await new Project({
            name: "LIST-TEST: Project",
            creator: user._id,
            num: Math.floor(Date.now() * Math.random())
        }).save();
        project.addAuth(user);
    });

    it("should create a new list and return status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            params: {
                projectnum: project.num
            },
            body: {
                newListInput: "LIST-TEST: Create list test",
                newListDueDate: JSON.stringify(project.createdAt).split("T")[0]
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

        listApiController.addList(req, res, () => {})
            .then(() => {
                list = res.json.newList;
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("newList");
                expect(res.json).to.have.property("listNum");

                done();
            });
    });

    it("should edit list content and return status 200", (done) => {
        req = {
            params: {
                listId: list._id
            },
            body: {
                content: "LIST-TEST: Edit list test"
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

        listApiController.editList(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("editStatus");

                done();
            });
    });

    it("should check list and return status 200", (done) => {
        req = {
            params: {
                listId: list._id
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

        listApiController.checkList(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("checkStatus");

                done();
            });
    });

    it("should reset list due date and return status 200", (done) => {
        req = {
            params: {
                listId: list._id
            },
            body: {
                newDueDate: "2038-01-19"
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

        listApiController.setDueDate(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("setStatus");

                done();
            });
    });

    it("should delete list and return status 200", (done) => {
        req = {
            params: {
                projectnum: project.num,
                listId: list._id
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

        listApiController.deleteList(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("deleteStatus", true);
                expect(res.json).to.have.property("remainingListNum");

                done();
            });
    });
});