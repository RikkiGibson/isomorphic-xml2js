const webpack = require('webpack');
const glob = require("glob");
const path = require('path');

const config = {
  entry: [...glob.sync('./test/*.ts'), ...glob.sync('./node-xml2js/test/**/*.coffee')],
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname
  },
  output: {
    filename: 'testBundle.js',
    path: __dirname
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /(node_modules)/,
        options: { configFile: path.join(__dirname, "/tsconfig.es5.json") }
      },
      {
        test: /\.coffee$/,
        loader: 'coffee-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".coffee"],
    alias: {
      "../lib/index": path.join(__dirname, "lib/browser")
    }
  },
  node: {
    net: false,
    path: true,
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false
  }
};

module.exports = config;