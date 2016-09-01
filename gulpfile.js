const gulp = require('gulp');
const path = require('path');
const webpackStream = require('webpack-stream');
const mocha = require('gulp-mocha');
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

function runMochaTests() {
  require('babel-core/register');
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha({
       reporter: 'dot',
       ignoreLeaks: false
  }));
}

function lint() {
  return gulp.src('src/**/*')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

gulp.task('build', build);
gulp.task('test', runMochaTests);
gulp.task('lint', lint);
gulp.task('default', ['build']);
