const expect = require("chai").expect;
const request = require("supertest");
const cheerio = require("cheerio");

describe("auth", () => {
    before(() => {
        app = require("../../app");
    });

    it("should render sign up page and return title `Pandolist: Sign up` and status 200", (done) => {
        request(app)
            .get("/auth/sign-up")
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include("Pandolist: Sign up")
                done();
            });
    });
    it("should render sign in page and return title `Pandolist: Sign in` and status 200", (done) => {
        request(app)
            .get("/auth/sign-in")
            .then(res => {
                const $ = cheerio.load(res.text);
                expect(res.statusCode).to.equal(200);
                expect($("title").text()).to.include("Pandolist: Sign in")
                done();
            })
    })
})