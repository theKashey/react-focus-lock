const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const mode = process.env.NODE_ENV || 'development';

console.log('mode', mode);

module.exports = {
  mode: 'development',
  optimization: {
    usedExports: true
  },
  entry: './app/client.js',
  devtool: false,
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    //   alias: {
    //     "react": "preact/compat",
    //     "react-dom": "preact/compat",
    //   }
  },
  optimization: {
    concatenateModules: false,
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ]
};
