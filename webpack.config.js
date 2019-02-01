const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  watch: process.env.NODE_ENV !== 'production',
  entry: ['./src/index.tsx', 'webpack-plugin-serve/client'],
  output: {
    path: path.resolve(__dirname, './dist'),
    pathinfo: true,
    filename: 'retro.[hash].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
  },

  resolve: {
    modules: ['node_modules', path.resolve(__dirname, './src')],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },

  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, './src'),
        exclude: /node_modules/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Exclude `js` files to keep "css" loader working as it injects
        // it's runtime that would otherwise processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.js$/, /\.tsx?$/, /\.html$/, /\.json$/, /\.css$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new WebpackPluginServe({
      open: true,
      port: 6000,
      progress: 'minimal',
    }),
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },

  devtool:
    process.env.NODE_ENV === 'production'
      ? undefined
      : 'cheap-module-eval-source-map',
};
