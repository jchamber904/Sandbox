var config = {
    response : "Hello, world! This is a demo app..",
    port : process.env.PORT || process.env.VCAP_APP_PORT || 3000
};

module.exports = config;

console.log("Starting server...");
