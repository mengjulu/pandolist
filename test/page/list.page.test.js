const expect = require("chai").expect;
const User = require("../../models/user");
const Project = require("../../models/project");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const cheerio = require("cheerio");

let app;
let userAgent;
let user;
let project;

describe("list", () => {

    before(async () => {
        //set test user data
        user = await new User({
            account: "LIST-TEST@com",
            password: await bcrypt.hash("LIST-TEST", 10),
            name: "LIST-TEST"
        }).save();

        //set test project data
        project = await new Project({
            name: "INDEX-TEST: Project",
            creator: user._id,
            num: Math.floor(Date.now() * Math.random())
        }).save();

        project.addAuth(user);
        app = require("../../app");
        userAgent = request.agent(app);
    });

    it("should log in and store data in userAgent", (done) => {

        userAgent
            .post("/auth/sign-in")
            .send({
                account: "LIST-TEST@com",
                password: "LIST-TEST"
            })
            .expect(302)
            .expect("Location", "/")
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })

    });

    it("should render list page, return title `Pandolist: {project.name}` and status 200", (done) => {
        userAgent
            .get(`/list/${project.num}`)
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include(`Pandolist: ${project.name}`);
                done();
            })
    });

    it("should render error page, return title `Sorry! ;(` and status 200", (done) => {
        userAgent
            .get(`/list/test`)
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include("Sorry! ;(")
                done();
            });
    });

    after(async () => {
        await User.deleteOne({_id: user._id});
        await Project.deleteOne({_id: project._id});
    });
});