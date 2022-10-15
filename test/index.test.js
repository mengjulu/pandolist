const expect = require("chai").expect;
const sinon = require("sinon");
const Project = require("../models/project");
const List = require("../models/list");
const User = require("../models/user");
const indexController = require("../controller/page/indexController");
const indexApiController = require("../controller/api/indexApiController");
let req;
let res;
let user;
let project;

describe("index", () => {
    before(() => {
        sinon.stub(List, "find").returns({
            populate: () => {
                return []
            }
        });
        user = sinon.stub(User, "findById");
        project = sinon.stub(Project, "find")
    });

    it("should return index page elements (visitor) and status 200", async () => {
        req = {};

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

        await indexController.indexPage(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("index/index-unauth");
        expect(res.obj).to.deep.equal({
            title: "Pandolist"
        });
    });

    it("should return index page elements (user) and status 200", async () => {
        const userName = "testUser";
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
                    name: userName,
                    project: []
                };
            }
        })

        await indexController.indexPage(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("index/index-auth");
        expect(res.obj).to.deep.equal({
            title: `Pandolist: ${userName}`,
            offCanvasProject: [],
            lists: [],
            csrfToken: "csrfToken"
        });
    });

    it("should return search result page elements (result not found) and status 404", async () => {
        const keyword = "keywordtest";
        req = {
            user: {
                _id: ""
            },
            query: {
                q: keyword
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
                return []
            }
        });

        await indexController.searchResult(req, res, () => {});
        expect(res.statusCode).to.equal(404);
        expect(res.view).to.equal("error");
        expect(res.obj).to.deep.equal({
            title: `Search result: ${keyword}`,
            offCanvasProject: [],
            errorMessage: "Hmmm... Lists are not found. Please try again!"
        });
    });

    it("should return search result page elements and status 200", async () => {
        const keyword = "keywordtest";
        const searchProjects = [{
                list: ["test1"]
            },
            {
                list: ["test2"]
            }
        ];
        req = {
            user: {
                _id: ""
            },
            query: {
                q: keyword
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
                return searchProjects
            }
        });

        await indexController.searchResult(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.view).to.equal("searchResult");
        expect(res.obj).to.deep.include({
            title: `Search result: ${keyword}`,
            key: keyword,
            searchProjects: searchProjects,
            offCanvasProject: []
        });
    });

    it("should return all undone lists and status 200", async () => {

        req = {
            user: {
                _id: ""
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
        }

        project.returns({
            populate: () => {
                return [{
                        list: ["test1"]
                    },
                    {
                        list: ["test2"]
                    }
                ]
            }
        });
        await indexApiController.mylist(req, res, () => {});
        expect(res.statusCode).to.equal(200);
        expect(res.json.allUndoneLists).to.be.an("array").that.includes("test1", "test2");
    })

    after(() => {
        User.findById.restore();
        Project.find.restore();
        List.find.restore();
    });
});