const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry:
      {
          options: './src/components/options',
          tab: './src/components/tab',
          background: './src/background'
      }
  ,
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
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
        {
            test: /\.scss$|.css$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }
    ]
  }
};




