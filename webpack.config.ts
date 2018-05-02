import * as webpack from 'webpack';
import * as path from 'path';

const config: webpack.Configuration = {
  entry: './lib/browser.ts',
  devtool: 'source-map',
  mode: "production",
  output: {
    filename: 'xml2jsBundle.js',
    path: __dirname,
    libraryTarget: 'var',
    library: 'xml2js'
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /(node_modules|test)/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
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

export default config;