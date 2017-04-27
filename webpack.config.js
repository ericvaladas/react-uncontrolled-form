const path = require('path');
const webpack = require('webpack');
const manifest = require('./package.json');

const mainFile = manifest.main;
const packageName = manifest.name;
const destinationDirectory = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));

module.exports = {
  entry: ['./src/formwood.js'],
  output: {
    path: path.resolve(__dirname, destinationDirectory),
    filename: `${exportFileName}.js`,
    library: packageName,
    libraryTarget: 'umd'
  },
  externals: ['react'],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {loader: 'babel-loader'}
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: false,
      mangle: false,
      comments: false
    })
  ]
};
