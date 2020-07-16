require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SRC_DIR = path.resolve(__dirname, 'src');
const appDir = path.resolve(__dirname, 'build');

const config = {
  entry: ['babel-polyfill', './src/index.js'],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'file-loader'
      },
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { 
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};

module.exports = config;
