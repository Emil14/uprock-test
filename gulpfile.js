'use strict';

var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	jade = require('gulp-jade'),
	jadeGlobbing  = require('gulp-jade-globbing'),
	stylus = require('gulp-stylus'),
	fontAwesomeStylus = require( "fa-stylus" ),
	autoprefixer = require('autoprefixer-stylus'),
	coffee  = require ('gulp-coffee'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	rigger = require('gulp-rigger'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	plumber = require('gulp-plumber'),
	errorHandler = require('gulp-plumber-error-handler');

var path = {
	build: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/'
	},
	src: {
		jade: 'app/*.jade',
		coffee: 'app/coffee/app.coffee',
		style: 'app/styl/app.styl',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*'
	},
	watch: { 
		jade: 'app/**/*.jade',
		coffee: 'app/**/*.coffee',
		style: 'app/**/*.styl',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*'
	},
	clean: './dist'
};

gulp.task('html:build', () => {
	return gulp.src(path.src.jade)
		.pipe(jadeGlobbing())
		.pipe(jade({
			basedir: 'app',
			pretty: true
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true})); 
});

gulp.task('js:build', () => {
	return gulp.src(path.src.coffee)
		.pipe(sourcemaps.init())
		.pipe(rigger())
		.pipe(coffee({bare: true}).on('error', gutil.log))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js)) 
		.pipe(reload({stream: true})); 
});

gulp.task('style:build', () => {
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: errorHandler('Error in \'styles\' task')}))
		.pipe(stylus({
			use: [
				fontAwesomeStylus(),
				autoprefixer('last 4 version')
			],
			compress: true
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true})); 
});

gulp.task('image:build', () => {
	gulp.src(path.src.img) 
		.pipe(imagemin({ 
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img)) 
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', () => {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true})); 
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'image:build',
	'fonts:build'
]);

var config = {
	server: {
		baseDir: "./dist"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "Emil14"
};

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('watch', function(){
	gulp.watch(path.watch.jade, ['html:build']);
	gulp.watch(path.watch.style, ['style:build']);
	gulp.watch(path.watch.coffee, ['js:build']);
	gulp.watch(path.watch.img, ['image:build']);
	gulp.watch(path.watch.fonts, ['fonts:build']);
});

gulp.task('default', ['build', 'webserver', 'watch']);