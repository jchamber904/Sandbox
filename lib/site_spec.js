var supertest = require("supertest"),
config = require("config"),
app = require("./app.js")();

describe("GET /", function () {
    it("respond with " + config.response, function (done) {
        supertest(app)
        .get("/")
        .expect(200, config.response, done);
    });
});
