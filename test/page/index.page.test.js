const expect = require("chai").expect;
const User = require("../../models/user");
const List = require("../../models/list");
const Project = require("../../models/project");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const cheerio = require("cheerio");

describe("index", () => {

    let app;
    let userAgent;
    let user;
    let list;

    before(async () => {
        //set test user data
        user = await new User({
            account: "INDEX-TEST@com",
            password: await bcrypt.hash("INDEX-TEST", 10),
            name: "INDEX-TEST"
        }).save();

        //set test project data
        project = await new Project({
            name: "INDEX-TEST: Project",
            creator: user._id,
            num: Math.floor(Date.now() * Math.random())
        }).save();
        project.addAuth(user);

        //set test list data
        list = await new List({
            project: project._id,
            content: "INDEX-TEST: List",
            creator: user._id,
            start: "2038-01-19",
            end: "2038-01-19"
        }).save();
        project.addListId(list._id);

        app = require("../../app");
        userAgent = request.agent(app);

    });

    it("should log in and store data in userAgent", (done) => {
        userAgent
            .post("/auth/sign-in")
            .send({
                account: "INDEX-TEST@com",
                password: "INDEX-TEST"
            })
            .expect(302)
            .expect("Location", "/")
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    it("should render index page, return title `Pandolist: {user name}` and status 200", (done) => {
        userAgent
            .get("/")
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include(`Pandolist: ${user.name}`)
                done();
            })
    });

    it("should render search result and title `Search result: TEST` and status code 200", (done) => {
        userAgent
            .get("/search")
            .query({
                q: "TEST"
            })
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include("Search result: TEST")
                done();
            })
    });
    after(async () => {
        await User.deleteOne({
            _id: user._id
        });
        await Project.deleteOne({
            _id: project._id
        });
        await List.deleteOne({
            _id: list._id
        });
    });
});