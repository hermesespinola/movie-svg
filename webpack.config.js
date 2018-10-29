const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname)
const ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const JS_PATH = path.resolve(ROOT_PATH, 'src/js')
const CSS_PATH = path.resolve(ROOT_PATH, 'src/css')
const TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html')
const BUILD_PATH = path.resolve(ROOT_PATH, 'public')

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WebGL App',
      template: TEMPLATE_PATH,
      cache: true,
    }),
    new webpack.LoaderOptionsPlugin({
      debug,
    }),
    new Dotenv(),
  ],
  resolve: {
    modules: [JS_PATH, CSS_PATH, SRC_PATH, 'node_modules/'],
    descriptionFiles: ['package.json'],
    extensions : ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: JS_PATH,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        },
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.css$/,
        include: CSS_PATH,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  devtool: debug ? 'eval-source-map' : 'source-map',
}
