const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const appDir = path.resolve(__dirname, 'build');

module.exports = merge(common, {
  devtool: false,
  output: {
    path: appDir,
    filename: 'main.js',
    publicPath: '/panorama/photogrammar'
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
    })]
  },
  plugins: [
    new webpack.DefinePlugin({
      //'process.env.NODE_ENV': JSON.stringify('production')
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PUBLIC_URL: JSON.stringify('/panorama/photogrammar')
      }
    })
  ]
});
