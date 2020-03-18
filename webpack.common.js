require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SRC_DIR = path.resolve(__dirname, 'src');
const appDir = path.resolve(__dirname, 'build');

const config = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: appDir,
    filename: 'main.js'
  },
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
  plugins: [
   // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      title: 'Photogrammar',
      filename: 'index.html',
      appMountId: 'root',
      links: [
        'https://fonts.googleapis.com/css?family=Merriweather:300|Lato:400,100,300|Lora:100,400|Crimson+Text:400i|PT+Sans:400',
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
      ]
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: process.env.NODE_ENV === 'development'
    })
  ],
  node: {
    fs: 'empty'
  }
};

module.exports = config;
