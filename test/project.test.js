const expect = require("chai").expect;
const sinon = require("sinon");
const Project = require("../models/project");
const User = require("../models/user");
const List = require("../models/list");
const Message = require("../models/message");
const projectApiController = require("../controller/api/projectApiController");
let user;
let newProject;
let project;
let req;
let res;

describe("project", () => {
    before(() => {
        sinon.stub(List, "deleteMany").returns({
            exec: () => {}
        });
        sinon.stub(Message, "deleteMany").returns({
            exec: () => {}
        });
        sinon.stub(Project, "exists").returns(true);
        sinon.stub(Project, "findOne").returns({
            name: "oldTitle",
            save: (name) => {
                return name;
            }
        });
        sinon.stub(Project, "deleteOne").returns({
            exec: () => {
                return {
                    deletedCount: 1
                }
            }
        });
        sinon.stub(User, "findById").returns("user");
        user = sinon.stub(User, "findOne");
        project = sinon.stub(Project, "findById");
        newProject = sinon.stub(Project.prototype, "save").returns({
            name: "",
            creator: "",
            addAuth: () => {}
        });
    });

    it("should add new project and return status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            body: {
                projectName: ""
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
        await projectApiController.addProject(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.newProject).to.be.an("object");
    });

    it("should change project title and return status 200", async () => {

        req = {
            body: {
                newTitle: "newTitle",
                projectNum: ""
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
        await projectApiController.changeTitle(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.projectName).to.equal("newTitle");
    });

    it("should add auth and return `Success` with status 200", async () => {
        req = {
            body: {
                projectId: "",
                userToBeAdd: "test"
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

        user.returns(true);
        project.returns({
            auth: ["test"],
            addAuth: () => {}
        });
        await projectApiController.addProjectAuth(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.addAuthStatus).to.equal("Success");
    })

    it("should add auth and return `No user` with status 404", async () => {
        req = {
            body: {
                projectId: "",
                userToBeAdd: ""
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
        user.returns(false);
        project.returns({
            auth: ["test"],
            addAuth: () => {}
        });

        await projectApiController.addProjectAuth(req, res, () => {});
        expect(res.statusCode).to.equal(404);
        expect(res.json.addAuthStatus).to.equal("No user");
    });

    it("should add auth and return `User exist` with status 400", async () => {
        req = {
            body: {
                projectId: "",
                userToBeAdd: ""
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
            _id: "test"
        });
        project.returns({
            auth: ["test"],
            addAuth: () => {}
        });

        await projectApiController.addProjectAuth(req, res, () => {});
        expect(res.statusCode).to.equal(400);
        expect(res.json.addAuthStatus).to.equal("User exist");
    });

    it("should remove auth and return status 200", async () => {
        req = {
            body: {
                projectId: "",
                userToBeRemove: ""
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
            _id: "test",
            project: []
        });
        project.returns({
            auth: [],
            removeAuth: () => {}
        });

        await projectApiController.removeProjectAuth(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.removeAuthStatus).to.be.true;
    });

    it("should delete project and return status 200", async () => {
        req = {
            body: {
                projectId: ""
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
            removeProjectId: () => {}
        });
        project.returns({
            auth: [],
            removeAuth: () => {}
        });
        await projectApiController.deleteProject(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.deleteStatus).to.be.true;

    });

    after(() => {
        User.findById.restore();
        User.findOne.restore();
        Project.exists.restore();
        Project.findById.restore();
        Project.findOne.restore();
        Project.deleteOne.restore();
        Project.prototype.save.restore();
        List.deleteMany.restore();
        Message.deleteMany.restore();
    });
});