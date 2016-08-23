var gulp = require("gulp");

var filter = require('gulp-filter');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');

gulp.task('js', function () {
    return gulp.src(['front/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify()).on('error', function (err) { console.log(err) })
        .pipe(gulp.dest('public/js'));
});

gulp.task('plugin-js', function () {
    return gulp.src(['src/chart.js'])
        .pipe(gulp.dest('dist'))
        .pipe(rename('chart.min.js'))
        .pipe(uglify()).on('error', function (err) { console.log(err) })
        .pipe(gulp.dest('dist'));
});

gulp.task('plugin-css', function () {
    return gulp.src(['src/chart.css'])
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss().on('error', function (err) { console.log(err); }))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    var filterCss = filter('**/*.css');
    return sass('front/scss/app.scss').on('error', function (err) { console.log(err.message); })
        .pipe(filterCss)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(filterCss.restore())
        .pipe(gulp.dest('public/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss().on('error', function (err) { console.log(err); }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('build-front', ['js', 'css', 'plugin-js', 'plugin-css']);

gulp.task('dev', ['build-front'], function (done) {
    gulp.watch('front/**/*.js', ['js']);
    gulp.watch('front/**/*.scss', ['css']);
    gulp.watch('src/chart.js', ['plugin-js']);
    gulp.watch('src/chart.css', ['plugin-css']);
});

gulp.task('default', ['dev']);

