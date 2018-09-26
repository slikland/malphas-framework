'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var del = require('del');

const AUTOPREFIXER_BROWSERS = ['ie >= 10','ie_mob >= 10','ff >= 30','chrome >= 34','safari >= 7','opera >= 23','ios >= 7','android >= 4.4','bb >= 10'];

gulp.task('cssApplication', function () {

    gulp.src('./src/css/auth/*.css')
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(concatCss('auth.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('./css'));

    gulp.src('./src/css/application/**/*.css')
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(concatCss('application.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('./css'));

    return console.log(' ---> BUILD CSS APPLICATION');
});




gulp.task('cssVendor', function () {

    gulp.src('./src/css/vendor/fontawesome-free-5.3.1/webfonts/*')
        .pipe(gulp.dest('./webfonts'));

    gulp.src([
            './src/css/vendor/fontawesome-free-5.3.1/css/all.css',
            './src/css/vendor/jquery.dataTables.min.css',

            './node_modules/bulma/css/bulma.css',
            './node_modules/animate.css/animate.css',
            './node_modules/flickity/css/flickity.css',
            './node_modules/jquery.modal/jquery.modal.css',
            './node_modules/sweetalert2/dist/sweetalert2.css',

            './node_modules/normalize.css/normalize.css',
        ])
        .pipe(concatCss('vendor.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('./css'));

    return console.log(' ---> BUILD CSS VENDOR');
});





gulp.task('javascriptApplication', function() {

    gulp.src([
            './src/js/main.js',
            './src/js/auth/**/*.js'
        ])
        .pipe(concat('auth.js'))
        .pipe(rename('auth.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));


    gulp.src([
            './src/js/main.js',
            './src/js/application/**/*.js'
        ])
        .pipe(concat('application.js'))
        .pipe(rename('application.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));

    return console.log(' ---> BUILD JAVASCRIPT APPLICATION');
});





gulp.task('javascriptVendor', function() {
    gulp.src([
            './src/js/vendor/modernizr-3.6.0.min.js',
            './src/js/vendor/jquery-1.12.4.min.js',
            './src/js/vendor/jquery-ui.min.js',
            './src/js/vendor/jquery.dataTables.min.js',
            './node_modules/flickity/dist/flickity.pkgd.js',
            './node_modules/jquery-modal/jquery.modal.min.js',
            './node_modules/sweetalert2/dist/sweetalert2.min.js',
        ])
        .pipe(concat('vendor.js'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));

    return console.log(' ---> BUILD JAVASCRIPT VENDOR');
});





gulp.task('image', function () {
    //gulp.src('./src/img/*.{png,gif,jpg}')
    gulp.src('./src/image/**/*')
        .pipe(gulp.dest('./image'));

    return console.log(' ---> BUILD IMAGES');
});





gulp.task('clean', () => del([
    'css/',
    'webfonts/',
    'image/',
    'js/'
]));





gulp.task('default', ['clean'], function () {
    runSequence(
        'cssApplication',
        'cssVendor',
        'javascriptApplication',
        'javascriptVendor',
        'image'
    );



    console.log(' ---> START GULP WATCH');
    gulp.watch('./src/css/auth/*.css', function() {
        runSequence('cssApplication');
    });
    gulp.watch('./src/css/application/*.css', function() {
        runSequence('cssApplication');
    });


    gulp.watch('./src/js/**/*.js', function() {
        runSequence('javascriptApplication');
    });

});