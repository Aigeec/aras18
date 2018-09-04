const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const path = require('path')
const glob = require('glob-all')

const BUILD = process.env.npm_lifecycle_event === 'build'

const config = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        style: {
          test: /\.(css|sass|scss)$/,
          chunks: 'initial'
        }
      }
    }
  },
  entry: './src/entry.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist/public')
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'WEB_SOCKET_URL',
        replace: BUILD ? 'aras18.com' : 'localhost:6001'
      }
    },
    {
      test: /\.jsx?/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.(css|sass|scss)$/,
      use: [
        ExtractCssChunks.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        { loader: 'sass-loader' }
      ]
    },
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        'file-loader',
        {
          loader: 'img-loader'
        }
      ]
    },
    {
      test: /\.ico$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'favicon.ico'
          }
        }
      ]
    }]
  },

  plugins: [
    new ExtractCssChunks({
      filename: '[name].css',
      chunkFilename: '[id].css',
      hot: !BUILD
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, './src/index.html'),
        path.join(__dirname, './src/js/**/*.js')
      ]),
      purifyOptions: {
        whitelist: ['liquid*']
      }
    })
  ],

  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
}

module.exports = config

if (!BUILD) {
  config.plugins.push(new BundleAnalyzerPlugin())

  const proxy = require('http-proxy-middleware')
  const convert = require('koa-connect')
  const history = require('connect-history-api-fallback')
  const Router = require('koa-router')

  const router = new Router()

  const proxyOptions = {
    target: 'ws://localhost:6001',
    changeOrigin: true,
    ws: true
  }

  router.get('*', convert(proxy(proxyOptions)))
  module.exports.serve = {
    logLevel: 'debug',
    add: (app, middleware, options) => {
      middleware.webpack().then(() => {
        app.use(router.routes())
      })
      app.use(convert(history({})))
    }
  }
}
