var gulp = require("gulp"),
    path = require("path"),
    url = require("url"),
    config = require("./lib/config"),
    paths = {
        sass: [
            "src/**/*.scss"
        ],
        js: [
            "**/*.js",
            "!src/scripts/**/*.js",
            "!coverage/**/*.js",
            "!node_modules/**/*.js",
            "!.build/**/*.js"
        ]
    };

//Test Tasks
gulp.task("scsslint", function () {
    var scsslint = require("gulp-scss-lint");

    return gulp.src(paths.sass)
        .pipe(scsslint({
            config: ".scss-lint.yml",
            bundleExec: true
        }))
        .pipe(scsslint.failReporter());
});

gulp.task("jscs", function () {
    var jscs = require("gulp-jscs");

    return gulp.src(paths.js)
        .pipe(jscs());
});

gulp.task("jshint", function () {
    var jshint = require("gulp-jshint");

    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("server", function () {
    var app = require("./lib/app")(),
    port = config.port;

    app.listen(port, function () {
        console.log("Started the app at port " + port);
    });
});

gulp.task("mocha-test", function (done) {
    var istanbul = require("gulp-istanbul"),
        mocha = require("gulp-mocha");

    gulp.src([
        "lib/**/*.js",
        "!lib/**/*_spec.js"
    ])
    .pipe(istanbul({
        includeUntested: true
    }))
    .pipe(istanbul.hookRequire()) //Force `require` to return covered files
    .on("finish", function () {
        gulp.src(["test/**/*.js", "lib/**/*_spec.js"])
            .pipe(mocha({
                reporter: "spec",
                require: [
                    path.resolve(__dirname, "lib/mocha-exports")
                ]
            }))
            .pipe(istanbul.writeReports())
            //Enforce a coverage of 100%
            .pipe(istanbul.enforceThresholds({
                thresholds: {
                    global: 100
                }
            }))
            .on("end", done);
    });
});

gulp.task("integration", function () {
    var webdriver = require("gulp-webdriver"),
        seleniumUrl = process.env.SELENIUM_SERVER_URL,
        opts = {
            desiredCapabilities: {
                browserName: "chrome"
            }
        };

    if (seleniumUrl) {
        var selUrlObj = url.parse(seleniumUrl);

        opts.host = selUrlObj.hostname;
        opts.port = selUrlObj.port;
    }

    gulp.src("integration-test/**/*.js", { read: false })
        .pipe(webdriver(opts));
});

gulp.task("lint", ["jscs", "jshint", "scsslint"]);

gulp.task("test", ["lint", "mocha-test"]);
