import * as webpack from 'webpack';
import * as glob from 'glob';
import * as path from 'path';

const config: webpack.Configuration = {
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
        exclude: /(node_modules)/
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
      "../lib/index": path.join(__dirname, "lib/browser"),
      "../lib/xml2js": path.join(__dirname, "test/xml2js-facade"),
      "fs": path.join(__dirname, "test/fs-stub.test")
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

export = config;