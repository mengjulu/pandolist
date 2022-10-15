const expect = require("chai").expect;
const sinon = require("sinon");
const Project = require("../models/project");
const Message = require("../models/message");
const User = require("../models/user");
const List = require("../models/list");
const listController = require("../controller/page/listController");
const listApiController = require("../controller/api/listApiController");
let req;
let res;
let user;
let list;
let project;

describe("list", () => {

    before(() => {
        project = sinon.stub(Project, "findOne");
        user = sinon.stub(User, "findById");
        list = sinon.stub(List, "findById");
        sinon.stub(List.prototype, "save").returns(["1", "2"]);
        sinon.stub(List, "deleteOne").returns({
            exec: () => {
                return {
                    deletedCount: 1
                }
            }
        });
        sinon.stub(List, "updateMany").returns({
            exec: () => {
                return {
                    modifiedCount: 1
                }
            }
        });
        sinon.stub(Message, "find").returns({
            populate: () => {
                return []
            }
        });
    });

    it("should return list page elements and status 200", async () => {
        const thisProject = {
            name: "test",
            list: [],
            auth: []
        };
        req = {
            user: {
                _id: ""
            },
            params: {
                projectnum: ""
            },
            query: {
                sort: ""
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
        });
        project.returns({
            populate: () => {
                return {
                    populate: () => {
                        return thisProject
                    }
                }
            }
        });
        await listController.listpage(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("list/listpage");
        expect(res.obj).to.deep.include({
            title: `Pandolist: ${thisProject.name}`,
            offCanvasProject: [],
            thisProject: thisProject,
            lists: thisProject.list,
            users: thisProject.auth,
            messages: [],
            csrfToken: "csrfToken"
        });
    });

    it("should return list page elements (list not found) and status 401", async () => {
        const thisProject = {
            name: "test",
            list: [],
            auth: []
        };
        req = {
            user: {
                _id: ""
            },
            params: {
                projectnum: ""
            },
            query: {
                sort: ""
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
        });
        project.returns({
            populate: () => {
                return {
                    populate: () => {
                        return;
                    }
                }
            }
        });
        await listController.listpage(req, res, () => {});
        expect(res.statusCode).to.equal(401);
        expect(res.view).to.equal("error");
        expect(res.obj).to.deep.equal({
            title: "Sorry! ;(",
            offCanvasProject: [],
            errorMessage: "Oops! The project is not existed or you are not authorized."
        });
    });

    it("should create a new list and return status 200", async () => {
        req = {
            user: {
                _id: ""
            },
            params: {
                projectnum: ""
            },
            body: {
                newListInput: "",
                newListDueDate: ""
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

        project.returns({
            _id: "testProjectId",
            list: ["1", "2"],
            addListId: () => {}
        });
        await listApiController.addList(req, res, () => {})
        expect(res.statusCode).to.equal(200);
        expect(res.json.newList).to.be.an("array").that.includes("1", "2");
        expect(res.json.listNum).to.equal(2);
    });

    it("should edit list content and return status 200", async () => {
        req = {
            params: {
                listId: ""
            },
            body: {
                editListInput: "newContent"
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
        list.returns({
            content: "oldContent",
            save: () => {
                return {
                    content: "newContent"
                }
            }
        });

        await listApiController.editList(req, res, () => {})
        expect(res.statusCode).to.equal(200);
        expect(res.json.editStatus).to.be.true;
    });

    it("should check list and return status 200", async () => {
        req = {
            params: {
                listId: ""
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

        list.returns({
            check: false,
            save: () => {}
        });

        await listApiController.checkList(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.checkStatus).to.be.true;
    });

    it("should reset list due date and return status 200", async () => {
        req = {
            params: {
                listId: ""
            },
            body: {
                newDueDate: ""
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

        await listApiController.setDueDate(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.setStatus).to.be.true;
    });

    it("should delete list and return status 200", async () => {
        req = {
            params: {
                projectnum: "",
                listId: ""
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
        project.returns({
            _id: "testProjectId",
            list: ["1", "2"],
            removeListId: () => {}
        });
        await listApiController.deleteList(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.deleteStatus).to.be.true;
        expect(res.json.remainingListNum).to.equal(2);
    });

    after(() => {
        Message.find.restore();
        Project.findOne.restore();
        User.findById.restore();
        List.findById.restore();
        List.updateMany.restore();
        List.deleteOne.restore();
        List.prototype.save.restore();
    });
});