const webpack = require('webpack');
const path = require('path');

module.exports = (baseConfig, env, defaultConfig) => {

  // defaultConfig.resolve.alias['../src/index'] = path.resolve(__dirname, '../dist/es2015/index.js')

  return defaultConfig;
};