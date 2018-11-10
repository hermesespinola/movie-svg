const path = require('path')
const Dotenv = require('dotenv-webpack')

const ROOT_PATH = path.resolve(__dirname)
const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const JS_PATH = path.resolve(ROOT_PATH, 'src/js')
const CSS_PATH = path.resolve(ROOT_PATH, 'src/css')
const BUILD_PATH = path.resolve(ROOT_PATH, 'public')

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'bundle.js',
  },
  target: 'web',
  plugins: [
    new Dotenv(),
  ],
  resolve: {
    modules: [JS_PATH, CSS_PATH, SRC_PATH, 'node_modules/'],
    descriptionFiles: ['package.json'],
    extensions : ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: JS_PATH,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-0'],
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
  devServer: {
    historyApiFallback: true,
  },
  node: {
    fs: 'empty',
  },
}
