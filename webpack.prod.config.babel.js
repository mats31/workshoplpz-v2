import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
// import StatsWebpackPlugin from 'stats-webpack-plugin';

export default {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/build`,
    publicPath: '/workshoplpz/',
    filename: '[name]-[hash].min.js',
  },
  resolve: {
    root: path.resolve( __dirname, 'src' ),
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
        test: /\.html?$/,
        exclude: /node_modules/,
        loader: 'html',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /node_modules/,
        loader: 'ify',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      // {
      //   test: /\.(woff)$/,
      //   loader: 'file',
      //   query: {
      //     limit: 8192,
      //     name: '[name].[ext]',
      //     publicPath: '/workshoplpz/',
      //   },
      // },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('css-loader?sourceMap!resolve-url-loader!stylus-loader'),
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader',
        // exclude: /node_modules/,
      },
      {
        test: /animation.gsap\.js$/,
        loader: 'imports?define=>false',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: './src/template/index.prod.tpl.html',
    }),
    new webpack.ProvidePlugin({
      THREE: 'three',
      Vue: 'vue/dist/vue',
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
    ],
    { ignore: ['.DS_Store', '.keep'] }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     drop_console: true,
    //     pure_funcs: ['console.log'],
    //   },
    // }),
    new ExtractTextPlugin('[name]-[hash].min.css', { allChunks: true, publicPath: 'workshoplpz/' }),
    new CleanWebpackPlugin(['build'], { root: `${__dirname}` }),
  ],
};
