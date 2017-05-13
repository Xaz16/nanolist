var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglifyjs = require('gulp-uglify'),
    uglifycss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    replace = require('gulp-html-replace'),
    clean = require('gulp-clean'),
    order = require('gulp-run-sequence'),
    fs = require('fs'),
    rev = require('gulp-rev');

gulp.task('ext:script', function () {
    return gulp.src([
        'node_modules/muicss/dist/js/mui.min.js',
        'src/js/app.js'
    ])
        .pipe(concat('app.js'))
        // .pipe(uglifyjs())
        .pipe(gulp.dest('build/assets/'))
});

gulp.task('ext:style', function () {
    return gulp.src([
        'node_modules/muicss/dist/css/mui.min.css',
        'src/css/app.css'
    ])
        .pipe(concat('app.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('build/assets/'))

});

gulp.task('ext:html', function () {
    var json = JSON.parse(fs.readFileSync('./rev-manifest.json'));

    return gulp.src('src/popup.html')
        .pipe(replace({
            js: 'assets/' + json['app.js'],
            css: 'assets/' + json['app.css']
        }))
        .pipe(gulp.dest('build/'))
});

gulp.task('clean', function () {
    return gulp.src('build/assets', {read: false})
        .pipe(clean());
});

gulp.task('clean:unrev', function () {
    return gulp.src(['build/assets/app.css', 'build/assets/app.js'], {read: false})
        .pipe(clean());
});

gulp.task('rev', function () {
    return gulp.src(['build/assets/app.js', 'build/assets/app.css'])
        .pipe(rev())
        .pipe(gulp.dest('build/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'));
});

gulp.task('content:scripts', function () {
    return gulp.src(['src/js/*.js', '!src/js/app.js'])
        // .pipe(uglifyjs())
        .pipe(gulp.dest('build/assets'));
});

gulp.task('default', function () {
    order('clean', 'ext:script', 'ext:style', 'rev', 'clean:unrev', 'ext:html', 'content:scripts');
});