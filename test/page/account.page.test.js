const expect = require("chai").expect;
const User = require("../../models/user");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const cheerio = require("cheerio");

describe("account", () => {
    let app;
    let user;
    let userAgent;

    before(async () => {
        //set test user data
        user = await new User({
            account: "ACCOUNT-TEST@com",
            password: await bcrypt.hash("ACCOUNT-TEST", 10),
            name: "ACCOUNT-TEST"
        }).save();

        app = require("../../app");
        userAgent = request.agent(app);

    });

    it("should log in and store data in userAgent", (done) => {

        userAgent
            .post("/auth/sign-in")
            .send({
                account: "ACCOUNT-TEST@com",
                password: "ACCOUNT-TEST"
            })
            .expect(302)
            .expect("Location", "/")
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it("should render settings page, return title `Settings` and status 200", (done) => {

        userAgent
            .get("/account/settings")
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include("Settings")
                done();
            })
    });

    it("should render change password page, return title `Change password` and status 200", (done) => {

        userAgent
            .get("/account/password")
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include("Change password")
                done();
            });
    });
    after(async () => {
        await User.deleteOne({
            _id: user._id
        });
    });
});