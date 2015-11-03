var express = require("express"),
config = require("./config");

module.exports = function () {
    var app = express(),
    response = config.response;

    app.get("/", function (req, res) {
        res.send(response);
    });

    return app;
};
