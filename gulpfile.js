const gulp = require('gulp');
const sass = require('gulp-sass');
const webpackStream = require('webpack-stream');
const mocha = require('gulp-mocha');

function pack(filename) {
  return webpackStream({
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

function buildJavaScript() {
  return gulp.src('./src/js/app.js')
    .pipe(pack('app.js'))
    .pipe(gulp.dest('./dist/js'));
}

function buildCss() {
  return gulp.src('./src/sass/style.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
}

function watchSass() {
  return gulp.watch('./src/sass/**/*.sass', ['css']);
}

function watchJavaScript() {
  return gulp.watch('./src/js/**/*.js', ['js']);
}

function runMochaTests() {
  require('babel-core/register');
  // TODO: What does {read: false} do?
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha({
       reporter: 'dot',
       ignoreLeaks: false
  }));
}

gulp.task('js', buildJavaScript);
gulp.task('css', buildCss);
gulp.task('watch-js', watchJavaScript);
gulp.task('watch-sass', watchSass);
gulp.task('default', ['js', 'css']);
gulp.task('test', runMochaTests);
