const gulp = require('gulp');
const sass = require('gulp-sass');
const webpackStream = require('webpack-stream');
const mocha = require('gulp-mocha');
const express = require('express');


function pack(filename, watch) {
  return webpackStream({
    watch: watch,
    output: {
      filename: filename
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
  watch = watch === true || false;
  return gulp.src('./src/js/app.js')
    .pipe(pack('app.js', watch))
    .pipe(gulp.dest('./dist/js'));
}

function buildCss() {
  return gulp.src('./src/sass/style.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
}

function buildIndex() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
}

function watchSass() {
  return gulp.watch('./src/sass/**/*.sass', ['css']);
}

function watchJavaScript() {
  return buildJavaScript(true);
}

function runMochaTests() {
  require('babel-core/register');
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha({
       reporter: 'dot',
       ignoreLeaks: false
  }));
}

function runDevServer() {
  let app = express();
  app.use(express.static('./dist'));
  app.listen(8080);
}

gulp.task('js', buildJavaScript);
gulp.task('css', buildCss);
gulp.task('index', buildIndex);
gulp.task('watch-js', watchJavaScript);
gulp.task('watch-sass', watchSass);
gulp.task('default', ['js', 'css', 'index']);
gulp.task('test', runMochaTests);
gulp.task('dev-server', runDevServer);
