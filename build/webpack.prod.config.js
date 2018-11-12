const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('../webpack.config');

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
