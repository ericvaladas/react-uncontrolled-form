const gulp = require('gulp');
const path = require('path');
const webpackStream = require('webpack-stream');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-babel-istanbul');
const coveralls = require('gulp-coveralls');
const codecov = require('gulp-codecov');
const eslint = require('gulp-eslint');
const manifest = require('./package.json');

const mainFile = manifest.main;
const packageName = manifest.name;
const destinationDirectory = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));


function build() {
  return gulp.src('./src/formwood.js')
    .pipe(webpackStream({
      externals: {
        "react": "react"
      },
      output: {
        filename: `${exportFileName}.js`,
        library: packageName,
        libraryTarget: 'umd'
      },
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }]
      }
    }))
    .pipe(gulp.dest(destinationDirectory));
}

function sendToCoveralls() {
  gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
}

function sendToCodecov() {
  gulp.src('coverage/**/lcov.info')
    .pipe(codecov());
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
gulp.task('codecov', sendToCodecov);
gulp.task('lint', lint);
gulp.task('default', ['build']);
