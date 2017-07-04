import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const Config = {
  devtool: 'inline-source-map',
  entry: './src/main.js',
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  resolve: {
    root: path.resolve( __dirname, 'src' ),
    alias: {
      fonts: path.resolve( __dirname, 'static/fonts' ),
    },
    extensions: [
      '',
      '.js',
      '.vue',
      '.json',
      '.styl',
    ],
  },
  module: {
    postLoaders: [
      {
        test: /\.js$/,
        loader: 'ify',
      },
    ],
    loaders: [
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /node_modules/,
        loader: 'ify',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('css-loader?sourceMap!resolve-url-loader!stylus-loader'),
        // loader: 'style-loader!css-loader!stylus-loader?resolve url',
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader',
      },
      {
        test: /animation.gsap\.js$/,
        loader: 'imports?define=>false',
      },
    ],
  },
  // glsl: {
  //   chunkPath: path(__dirname, '/glsl/chunks'),
  // },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'src/template/index.tpl.html',
    }),
    new ExtractTextPlugin('[name]-[hash].min.css', { allChunks: true }),
    new webpack.ProvidePlugin({
      THREE: 'three',
      Vue: 'vue/dist/vue',
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
    ]),
  ],
};

module.exports = Config;
