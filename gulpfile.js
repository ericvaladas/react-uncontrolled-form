const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const mocha = require('gulp-mocha');
const express = require('express');


function pack(filename, watch) {
  return webpackStream({
    watch: watch,
    output: {
      filename: filename,
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }
  });
}

function packLibrary(filename) {
  return webpackStream({
    externals: {
      "react": "react"
    },
    output: {
      filename: filename,
      library: 'ReactForms',
      libraryTarget: 'umd'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }
  });
}

function buildJavaScript(watch) {
  return gulp.src('./src/js/index.js')
    .pipe(packLibrary('index.js'))
    .pipe(gulp.dest('./lib'));
}

function buildExamples(watch) {
  watch = watch === true || false;
  return gulp.src('./examples/js/app.js')
    .pipe(pack('app.js', watch))
    .pipe(gulp.dest('./dist/examples/js'));
}

function buildExamplesIndex() {
  return gulp.src('./examples/index.html')
    .pipe(gulp.dest('./dist/examples'));
}

function watchExamples() {
  return buildExamples(true);
}

function runMochaTests() {
  require('babel-core/register');
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha({
       reporter: 'dot',
       ignoreLeaks: false
  }));
}

function runExamplesServer() {
  let app = express();
  app.use(express.static('./dist/examples'));
  app.listen(8000);
}

gulp.task('build', buildJavaScript);
gulp.task('default', ['build']);
gulp.task('test', runMochaTests);
gulp.task('examples-server', runExamplesServer);
gulp.task('examples-js', buildExamples);
gulp.task('examples-index', buildExamplesIndex);
gulp.task('build-examples', ['examples-index', 'examples-js']);
gulp.task('watch-examples', watchExamples);
