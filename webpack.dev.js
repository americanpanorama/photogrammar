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
  }
});
