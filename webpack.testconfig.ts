import * as webpack from 'webpack';
import * as glob from 'glob';
import * as path from 'path';

const config: webpack.Configuration = {
  entry: glob.sync('./test/*.ts'),
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
        exclude: /(node_modules)/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: { "../lib/index": path.join(__dirname, "./lib/browser") }
  },
  node: {
    fs: false,
    net: false,
    path: false,
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false
  }
};

export = config;