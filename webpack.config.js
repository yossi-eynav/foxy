var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
      './src/router'
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
          React: 'react',
          ReactDOM: 'react-dom',
          ReactRouter: 'react-router',
          ReactRedux: 'react-redux',
          Redux: 'redux',
          ReduxThunk: 'redux-thunk',
          fetch: 'isomorphic-fetch'
    }),
    new CopyWebpackPlugin([
      { from: './static'}
    ])
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }, 
    { test: /\.css$/,
      loader: "style-loader!css-loader" 
    }]
  },
    resolve: {
        alias: {

        }
    }
};




