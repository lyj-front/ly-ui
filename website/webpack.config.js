/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// 开发环境统一使用带 HMR 的浏览器构建
const vueBundle = isProd ? 'vue.esm-browser.prod.js' : 'vue.esm-browser.js'
const isPlay = !!process.env.PLAY_ENV

/** @type { import('webpack').Configuration } */
const config = {
  mode: isProd ? 'production' : 'development',
  devtool: !isProd && 'cheap-module-eval-source-map',
  entry: isPlay
    ? path.resolve(__dirname, './play.js')
    : path.resolve(__dirname, './entry.js'),
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, '../website-dist'),
    publicPath: '/lyj-front/ly-ui/',
    filename: isProd ? '[name].[hash].js' : '[name].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.mjs$/,
      //   include: /node_modules/,
      //   type: 'javascript/auto',
      // },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
          {
            loader: path.resolve(__dirname, './md-loader/index.js'),
          },
        ],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        // todo: 这种写法有待调整
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
    alias: {
      vue: `vue/dist/${vueBundle}`,
      'vue-router': path.resolve(
        __dirname,
        '../node_modules/vue-router/dist/vue-router.cjs'
      ),
      examples: path.resolve(__dirname),
    },
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './website/index.tpl',
      filename: './index.html',
      favicon: './website/favicon.ico',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, '../website-dist'),
          noErrorOnMissing: true,
        },
      ],
    }),
    // new BundleAnalyzerPlugin(),
    new ProgressBarPlugin(),
  ],
  devServer: {
    publicPath: '/lyj-front/ly-ui/',
    inline: true,
    disableHostCheck: true,
    hot: !isProd,
    stats: 'minimal',
    contentBase: __dirname,
    overlay: true,
    host: '0.0.0.0',
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
}

const cssRule = {
  test: /\.(sass|scss|css)$/,
  use: [
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
      },
    },
  ],
}

// if (isProd) {
config.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css',
  }),
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  })
)
cssRule.use.unshift(MiniCssExtractPlugin.loader)
// } else {
cssRule.use.unshift('style-loader')
// }
config.module.rules.push(cssRule)
module.exports = config
