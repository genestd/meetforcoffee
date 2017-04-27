var path = require('path');
var HtmlWebpackPlugin = require('webpack-html-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/server/views/index.html',
  filename: 'index.html',
  inject: 'body'
});
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports={
  devtool: "source-map",
  entry: [
    './server/public/index.js'
  ],
  output: {
    path: __dirname + '/server/public',
    //publicPath: 'https://github.com/genestd/portfolio',
    filename: "index_bundle.js"
  },
  devServer: {
    publicPath: '/',
    contentBase: __dirname + '/server/public'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader' },
      { test: /\.js$/, include: [
        path.resolve(__dirname, 'client'),
        path.resolve(__dirname, 'server/public'),
        path.resolve(__dirname, 'client/components'),
        path.resolve(__dirname, 'client/reducers'),
        path.resolve(__dirname, 'client/actions'),
      ], loader: "babel-loader"},
      { test: /\.css/, loader: ExtractTextPlugin.extract("css")},
      { test: /\.scss$/, loaders: [ 'style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap' ]},
    ]
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new CopyWebpackPlugin([
            { from: __dirname + '/client/styles/entypo', to: 'styles/entypo'},
        ]),
    new ExtractTextPlugin("styles.css"),
  ]
};
