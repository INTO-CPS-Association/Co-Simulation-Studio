const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  mode: "development",
  devtool: 'cheap-module-source-map',
  entry: './src/demo/index.ts',
  output: {
    filename: 'index.js'
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    open: true,
    hot: true,
    host: "localhost",
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true } },
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/index.css'
    }),
    new HtmlWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
  }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    fallback: {
      "crypto": false,
      "assert": false,
      "process": false,
      "buffer": require.resolve("buffer-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/")
    }
  }
};