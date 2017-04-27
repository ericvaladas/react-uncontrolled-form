const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackStream = require('webpack-stream');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-babel-istanbul');
const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const manifest = require('./package.json');

const mainFile = manifest.main
const destinationDirectory = path.dirname(mainFile);

function build() {
  return gulp.src('./src/formwood.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(destinationDirectory));
}

function sendToCoveralls() {
  gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
}

function runMochaTests() {
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha({
      reporter: 'dot',
      ignoreLeaks: false
    }));
}

function test() {
  require('babel-core/register');
  return gulp.src('src/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      runMochaTests()
        .pipe(istanbul.writeReports())
    });
}

function lint() {
  return gulp.src('src/**/*')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

gulp.task('build', build);
gulp.task('test', test);
gulp.task('coveralls', sendToCoveralls);
gulp.task('lint', lint);
gulp.task('default', ['build']);
