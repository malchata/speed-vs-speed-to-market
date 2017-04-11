// Module imports
const gulp = require("gulp");
const util = require("gulp-util");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const autorem = require("autorem");
const livereload = require("gulp-livereload");

// Module options
const moduleOpts = {
	autoprefixer: {
		browsers: ["last 2 versions", "> 5%", "ie >= 10", "iOS >= 8"]
	},
};

// SASS Build Task
const buildCSS = ()=>{
	let src = "htdocs/css/theme/source/speed.scss",
		dest = "htdocs/css/theme";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([autoprefixer(moduleOpts.autoprefixer), autorem(), cssnano()]))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

// HTML Task (Triggers Reloading Only)
const reloadPage = ()=>{
	let src = "htdocs/index.html";

	return gulp.src(src)
		.pipe(livereload());
};

exports.reloadPage = reloadPage;

// Watch Task
const watch = ()=>{
	livereload.listen();
	gulp.watch("htdocs/css/**/*.scss", buildCSS);
	gulp.watch("htdocs/index.html", reloadPage);
};

exports.default = watch;
