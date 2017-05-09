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

gulp.task('clean', function () {
   return gulp.src('build/assets', {read: false})
       .pipe(clean());
});

gulp.task('script', function () {
    return gulp.src([
        'src/js/app.js',
        'node_modules/muicss/dist/js/mui.min.js'
    ])
        .pipe(concat('app.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest('build/assets/'))
});

gulp.task('style', function () {
    return gulp.src([
        'src/css/app.css',
        'node_modules/muicss/dist/css/mui.min.css'
    ])
        .pipe(concat('app.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('build/assets/'))

});

gulp.task('html', function () {
    var json = JSON.parse(fs.readFileSync('./rev-manifest.json'));

    return gulp.src('src/popup.html')
        .pipe(replace({
            js: 'assets/' + json['app.js'],
            css: 'assets/' + json['app.css']
        }))
        .pipe(gulp.dest('build/'))
});

gulp.task('rev', function () {
    return gulp.src(['build/assets/app.js', 'build/assets/app.css'])
        .pipe(rev())
        .pipe(gulp.dest('build/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'));
});

gulp.task('default', function () {
    order('clean', 'script', 'style', 'rev', 'html');
});