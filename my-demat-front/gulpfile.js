console.time("Loading plugins");
var pckg = require('./package.json');
var gulp = require('gulp');
var zip = require('gulp-zip');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var plugins = require("gulp-load-plugins")({ pattern: "*" });
var fs = require("fs");
var args = require('yargs').argv;

/** Globals */
var paths = {
    source: "src/application/typescript/",
    assets: "src/application/assets/",
    referenceTs: "assets/references/**/*.d.ts",
    dist: "src/dist",
    linters: "src/application/angular/linters/",
    release: "release",
    tomcatFile: "src/application/angular/config/web.xml",
    tokens: "src/application/angular/config/"
};


/** External files */
var configTs = JSON.parse(fs.readFileSync("./tsconfig.json"));

var projectName = "my-demat-portail";
console.timeEnd("Loading plugins");

/** Remplacement token */
var TOKEN_DECORATOR = "##";
function parseTokenFile(tokenFileContent) {
    var result = {};
    var lines = tokenFileContent.split(/(\r|\n)+/);
    var line;
    for (var i = 0; i < lines.length; i++) {
        line = lines[i].split("=");
        if (line.length === 2) {
            var key = line[0];
            var value = line[1];
            if (key) {
                result[key] = value;
            }
        }
    }
    return result;
};

/** Get file token */
function getTokens() {
    var fileTokens;

    if (args.env === 'local') {
        fileTokens = fs.readFileSync(paths.tokens + "local.properties", "utf-8");
        //console.log(plugins.util.colors.green("the file used for token is : " + paths.tokens + "local.properties"));
    } else if (args.env && args.client) {
        fileTokens = fs.readFileSync(paths.tokens + args.client + "-" + args.env + ".properties", "utf-8");
        //console.log(plugins.util.colors.green("the file used for token is : " + paths.tokens + args.client + "-" + args.env + ".properties", "utf-8"));
    } else {
        console.error("client and env arguments not found");
        process.exit(1);
    }

    return parseTokenFile(fileTokens);
};

function replaceTokens() {
    var replaceToken = function (content, token, value) {
        var rx = new RegExp(TOKEN_DECORATOR + token + TOKEN_DECORATOR, "g");
        return content.replace(rx, value);
    };

    function transform(file, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        var content = String(file.contents);
        content = replaceToken(content, "NOM\\-APPLICATION", projectName);
        content = replaceToken(content, "LIBS\\-FOLDER", "libs");
        var tokens = getTokens();
        for (var key in tokens) {
            content = replaceToken(content, key, tokens[key]);
        }
        file.contents = new Buffer(content);
        callback(null, file);
    }
    return plugins.eventStream.map(transform);
};

/** Transpilation typescript */
var tsProject = plugins.typescript.createProject(configTs.compilerOptions);

gulp.task("compile-ts", ["tsLint"], function () {
    var sourceTsFiles = [paths.source + "**/*.ts", paths.referenceTs];
    var finalJSFile = projectName + ".js";
    var compiledTs = gulp.src(sourceTsFiles)
        .pipe(plugins.typescript(tsProject));

    // Fonction permettant de gÃ©rer les templateCache Angular
    var prepareTemplates = function prepareTemplates() {
        return gulp.src(paths.source + "**/*.html")
            //.pipe(minify and preprocess the template html here)
            .pipe(plugins.angularTemplatecache({
                standalone: false,
                module: projectName
            }));
    };
    // Ajout des templates html en fin de fichier js
    compiledTs.pipe(plugins.addStream.obj(prepareTemplates()))
        .pipe(replaceTokens())
        .pipe(plugins.concat(finalJSFile))
        .pipe(strip())
        // .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(paths.dist));
});

/** Compilation scss & copie css  */
gulp.task("compile-sass", ["sassLint", "css"], function () {
    gulp.src(paths.source + "**/*.scss")
        .pipe(plugins.sass().on("error", plugins.sass.logError))
        .pipe(plugins.concat(projectName + ".css"))
        .pipe(gulp.dest(paths.dist))
        .pipe(plugins.browserSync.stream());
});

gulp.task("css", ["cssHint"], function () {
    gulp.src(paths.assets + "css/*.css")
        .pipe(plugins.concat(projectName + ".css"))
        .pipe(gulp.dest(paths.dist))
        .pipe(plugins.browserSync.stream());
});

gulp.task("copy-main-html", ["htmlHint"], function () {
    gulp.src("src/application/index.html")
        .pipe(replaceTokens())
        .pipe(gulp.dest(paths.dist))
        .pipe(plugins.browserSync.stream());
});

gulp.task("copy-img", function () {
    gulp.src(paths.assets + "img/**/*")
        .pipe(gulp.dest(paths.dist + "/img"));
});

gulp.task("copy-translation", function () {
    gulp.src(paths.assets + "translations/**/*")
        .pipe(gulp.dest(paths.dist + "/translations"));
});

gulp.task("copy-fonts", function () {
    gulp.src(paths.assets + "fonts/**/*")
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task("copy-external-js", function () {
    gulp.src(paths.assets + "js/**/*")
        .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task("copy-libs", function () {
    var libs = [paths.assets + "libs/**/*.min.js", paths.assets + "libs/**/*.min.css", paths.assets + "libs/**/*.map", paths.assets + "libs/**/*.woff2", paths.assets + "libs/**/*.woff", paths.assets + "libs/**/*.ttf", paths.assets + "libs/**/ckeditor/**", paths.assets + "libs/**/angular-i18n/angular-locale_fr-fr.js"];
    gulp.src(libs).pipe(gulp.dest(paths.dist + "/libs"));
});


gulp.task("copy-webxml", function () {
    gulp.src(paths.tomcatFile)
        .pipe(gulp.dest(paths.dist + '/WEB-INF'));
});

/** Linters tasks */
gulp.task("htmlHint", function () {
    // var htmlHintConfig = JSON.parse(fs.readFileSync(paths.linters + "htmlHint.json"));
    // gulp.src(paths.source + "**/*.html")
    //     .pipe(plugins.htmlhint(htmlHintConfig))
    //     .pipe(plugins.htmlhint.reporter());
});

gulp.task("tsLint", function () {
    // var tsLintConfig = JSON.parse(fs.readFileSync(paths.linters + "tsLint.json"));
    // gulp.src(paths.source + "**/*.ts")
    //     .pipe(plugins.tslint(tsLintConfig))
    //     .pipe(plugins.tslint.report("verbose"));
});

gulp.task("sassLint", function () {
    // gulp.src(paths.source + "**/*.scss")
    //     .pipe(plugins.sassLint())
    //     .pipe(plugins.sassLint.format());
});

gulp.task("jsHint", function () {
    var jsHintConfig = JSON.parse(fs.readFileSync(paths.linters + "jsHint.json"));
    gulp.src(paths.dist + "**/*.js")
        .pipe(plugins.jshint(jsHintConfig))
        .pipe(plugins.jshint.reporter("default"));
});

gulp.task("cssHint", function () {
    // var cssLintConfig = JSON.parse(fs.readFileSync(paths.linters + "cssLint.json"));
    // gulp.src(paths.dist + "**/*.css")
    //     .pipe(plugins.csslint(cssLintConfig))
    //     .pipe(plugins.csslint.reporter());
});

/** Conventions */
gulp.task("check-name-convention", function () {
    gulp.src(paths.source)
        .pipe(plugins.checkFileNamingConvention({
            caseName: "lowerCase"
        }));
});

/** Browser Sync */
gulp.task("browserSync", function () {
    plugins.browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });
});

/** Help */
gulp.task("help", function () {
    var colors = plugins.util.colors;
    plugins.util.log(colors.green("Liste des tâches disponibles :"));
    plugins.util.log(colors.gray("Build tasks:"));
    plugins.util.log(colors.cyan("gulp build") + colors.red("\t\t\tbuild le projet"));
    plugins.util.log(colors.red("\t\t\t\tRequired: --env (l'environnement de travail), --client (le client concerné )"));
    plugins.util.log("\n");
    plugins.util.log(colors.gray("Server tasks:"));
    plugins.util.log(colors.cyan("gulp server") + colors.red("\t\t\tbuild le projet & demarre le server"));
    plugins.util.log(colors.red("\t\t\t\tRequired: --env=local"));
    plugins.util.log("\n");
    plugins.util.log(colors.gray("Release tasks:"));
    plugins.util.log(colors.cyan("gulp package : ") + colors.red("\t\tGenerer le package (war) apres le build du projet dans dossier release"));
    plugins.util.log(colors.red("\t\t\t\tRequired:  --client (le client concerné )"));
});

/** Basiques */
gulp.task("clean", function () {
    var destination = [paths.dist + "/**/*", paths.release + "/**/*"];
    return plugins.del(destination);
});

gulp.task("watch", function () {
    var filesApp = [paths.source + "**/*.ts", paths.source + "**/*.html"];
    gulp.watch(filesApp, ["compile-ts"]);
    gulp.watch("src/application/*.html", ["copy-main-html"]);
    gulp.watch(paths.source + "**/*.scss", ["compile-sass"]);
    gulp.watch(paths.assets + "css/*.css", ["css"]);
});

gulp.task("build", ["clean"], function () {
    plugins.runSequence(["check-name-convention", "copy-libs", "copy-translation", "copy-img", "copy-fonts", "copy-external-js"],
        ["compile-ts", "compile-sass", "copy-main-html"], "jsHint");
});

gulp.task("server", ["clean"], function () {
    plugins.runSequence("build", "watch", "browserSync");
});

gulp.task("default", ["help"], function () {
    // empty - depends on help task
});

gulp.task("package", function () {
    gulp.src(["src/dist/**/*"]).pipe(zip(args.client + "##" + pckg.version + ".war")).pipe(gulp.dest(paths.release));
});