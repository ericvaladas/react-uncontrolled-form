const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const mocha = require('gulp-mocha');



function packLibrary(filename) {
  return webpackStream({
    externals: {
      "react": "react"
    },
    output: {
      filename: filename,
      library: 'Formwood',
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

}

function runMochaTests() {
  require('babel-core/register');
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha({
       reporter: 'dot',
       ignoreLeaks: false
  }));
}


gulp.task('build', buildJavaScript);
gulp.task('default', ['build']);
gulp.task('test', runMochaTests);
