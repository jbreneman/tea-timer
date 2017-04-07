var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream');
	buffer = require('vinyl-buffer');
	browserSync = require('browser-sync').create();

var dirs = {
	src: './src/',
	build: './public/assets/'
};

// scss building
gulp.task('sass', function(){
	return gulp.src(dirs.src + 'css/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename('app.min.css'))
		.pipe(gulp.dest(dirs.build + 'css/'))
		.pipe(browserSync.stream());
});

// js transpilation
gulp.task('js', function(){
	browserify([dirs.src + 'js/app.js'])
		.transform(babelify, {presets: ["es2015"]})
		.bundle()
		.pipe(source('app.min.js'))
		.pipe(gulp.dest(dirs.build + 'js/'))
		.pipe(buffer())
		.pipe(browserSync.stream());
});

gulp.task('default', ['sass', 'js'], function() {
	browserSync.init({
        server: "./public"
    });

	gulp.watch(dirs.src + 'css/**/*.scss', ['sass']);
	gulp.watch(dirs.src + 'js/**/*.js', ['js']);
	gulp.watch('./public' + '**/*.html', function() {
		browserSync.reload();
	});
});