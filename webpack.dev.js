const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const appDir = path.resolve(__dirname, 'build');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: appDir,
    historyApiFallback: true,
    port: 9000
  },
  plugins: [
    new webpack.DefinePlugin({
      //'process.env.NODE_ENV': JSON.stringify('production')
      'process.env.PUBLIC_URL': JSON.stringify('')
    })
  ]
});
