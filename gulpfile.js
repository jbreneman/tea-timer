var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	browserify = require('gulp-browserify'),
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
	return gulp.src(dirs.src + 'js/app.js')
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(browserify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(dirs.build + 'js/'))
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