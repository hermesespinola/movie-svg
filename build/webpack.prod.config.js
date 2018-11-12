const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('../webpack.config');

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.AUTH_CALLBACK_URL': JSON.stringify(process.env.AUTH_CALLBACK_URL),
      'process.env.OKTA_ORG_URL': JSON.stringify(process.env.OKTA_ORG_URL),
      'process.env.OKTA_ISSUER_PATH': JSON.stringify(process.env.OKTA_ISSUER_PATH),
      'process.env.CALLBACK_PATH': JSON.stringify(process.env.CALLBACK_PATH),
      'process.env.OKTA_CLIENT_ID': JSON.stringify(process.env.OKTA_CLIENT_ID),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
