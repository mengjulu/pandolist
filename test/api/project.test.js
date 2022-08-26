const expect = require("chai").expect;
const User = require("../../models/user");
const Project = require("../../models/project");
const projectApiController = require("../../controller/api/projectApiController");

let user;
let userAuthTest;
let newProject;
let req;
let res;

describe("project", () => {
    before(async () => {
        //set test user data
        user = await new User({
            account: "PROJECT-TEST@com",
            password: "PROJECT-TEST",
            name: "PROJECT-TEST"
        }).save();
        userAuthTest = await new User({
            account: "PROJECT-TEST2@com",
            password: "PROJECT-TEST2",
            name: "PROJECT-TEST2"
        }).save();

    });

    it("should add new project and return status 200", (done) => {
        req = {
            user: {
                _id: user._id
            },
            body: {
                projectName: "PROJECT-TEST: Create project test"
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
        projectApiController.addProject(req, res, () => {})
            .then(async () => {
                //update variable manually
                newProject = await Project.findById(res.json.newProject._id);
                user.addProjectId(newProject._id);
                user.save();

                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("newProject");
                expect(res.json.newProject.name).to.equal("PROJECT-TEST: Create project test");
                done();
            })
    });

    it("should change project title and return status 200", (done) => {

        req = {
            body: {
                newTitle: "PROJECT-TEST: Change title test",
                projectNum: newProject.num
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
        projectApiController.changeTitle(req, res, () => {})
            .then(async () => {
                newProject.name = res.json.projectName;
                await newProject.save();

                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("projectName", "PROJECT-TEST: Change title test");
                done();
            });
    });

    it("should add auth and return `Success` with status 200", (done) => {
        req = {
            body: {
                projectId: newProject._id,
                userToBeAdd: userAuthTest.account
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

        projectApiController.addProjectAuth(req, res, () => {})
            .then(async () => {
                //update user status manually
                newProject.addAuth(userAuthTest);

                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("addAuthStatus", "Success");
            })
            .then(done, done);
    })

    it("should add auth and return `No user` with status 200", (done) => {
        req = {
            body: {
                projectId: newProject._id,
                userToBeAdd: "notExist"
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
        projectApiController.addProjectAuth(req, res, () => {})
            .then(async () => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("addAuthStatus", "No user");
                done();
            });
    });

    it("should add auth and return `User exist` with status 200", (done) => {
        req = {
            body: {
                projectId: newProject._id,
                userToBeAdd: userAuthTest.account
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
        projectApiController.addProjectAuth(req, res, () => {})
            .then(async () => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("addAuthStatus", "User exist");
            }).then(done, done);
    });

    it("should remove auth and return status 200", (done) => {
        req = {
            body: {
                projectId: newProject._id,
                userToBeRemove: userAuthTest.account
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
        projectApiController.removeProjectAuth(req, res, () => {})
            .then(async () => {
                //update user status manually
                await newProject.removeAuth(userAuthTest);

                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("removeAuthStatus");
                
                done();
            });
    });


    it("should delete project and return status 200", (done) => {
        req = {
            body: {
                projectId: newProject._id
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
        projectApiController.deleteProject(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(200);
                expect(res.json).to.have.property("deleteStatus");
                
                done();
            });
    });
});


describe("project page test", () => {

});