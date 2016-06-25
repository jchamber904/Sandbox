//
var config = {
    response : "Yeah! You have reached pages.github.ibm.com.",
    port : process.env.PORT || process.env.VCAP_APP_PORT || 443
};

module.exports = config;

console.log("Starting server...");
