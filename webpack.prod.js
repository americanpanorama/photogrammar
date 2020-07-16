const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const appDir = path.resolve(__dirname, 'build');

module.exports = merge({
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
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      title: 'Photogrammar',
      filename: 'index.html',
      appMountId: 'root',
      links: [
        'https://fonts.googleapis.com/css?family=Merriweather:300|Lato:400,100,300|Lora:100,400|Crimson+Text:400i|PT+Sans:400',
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/panorama/photogrammar/favicon.svg'
        },
        {
          rel: 'alternate icon',
          href:  '/panorama/photogrammar/favicon.ico'
        }
      ],
      // googleAnalytics: {
      //   trackingId: 'UA-4063620-19',
      //   pageViewOnLoad: true
      // },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
        // {
        //   property: 'og:url',
        //   content: 'https://dsl.richmond.edu/panorama/redlining/'
        // },
        // {
        //   property: 'og:title',
        //   content: 'Mapping Inequality'
        // },
        // {
        //   property: 'og:description',
        //   content: 'Redlining in New Deal America'
        // },
        // {
        //   property: 'og:image',
        //   content: 'https://dsl.richmond.edu/panorama/redlining/static/ogimage.png'
        // },
        // {
        //   property: 'og:image:width',
        //   content: '1200'
        // },
        // {
        //   property: 'og:image:height',
        //   content: '630'
        // }
      ],
    }),
  ]
}, common);
