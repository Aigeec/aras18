const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const glob = require('glob-all')

const BUILD = process.env.npm_lifecycle_event === 'build' || process.env.npm_lifecycle_event === 'webpack'

const config = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        style: {
          test: /\.(css|sass|scss)$/,
          chunks: 'initial'
        }
      }
    },
    minimizer: [
    ]
  },
  entry: './src/entry.js',
  output: {
    filename: BUILD ? '[contenthash].bundle.js' : 'bundle.js',
    path: path.resolve(__dirname, './dist/public')
  },
  mode: BUILD ? 'production' : 'development',
  devtool: BUILD ? 'source-map' : 'inline-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'WEB_SOCKET_URL',
        replace: BUILD ? 'aras18.com' : 'localhost:6001/ws'
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
      filename: BUILD ? '[contenthash].main.css' : 'bundle.css',
      hot: !BUILD
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, './src/index.html'),
        path.join(__dirname, './src/js/**/*.js')
      ]),
      purifyOptions: {
        whitelist: ['*fade*']
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

if (BUILD) {
  config.optimization
    .minimizer.push(new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }))
  config.optimization
    .minimizer.push(
      new OptimizeCSSAssetsPlugin({}))
}

if (!BUILD) {
  config.plugins.push(new BundleAnalyzerPlugin())

  const proxy = require('http-proxy-middleware')
  const convert = require('koa-connect')
  const history = require('connect-history-api-fallback')

  const proxyOptions = {
    target: 'ws://localhost:6001',
    changeOrigin: true,
    ws: true
  }

  module.exports.serve = {
    logLevel: 'debug',
    add: (app, middleware, options) => {
      app.use(convert(proxy('/ws', proxyOptions)))
      app.use(convert(proxy('/api', { target: 'http://localhost:6001' })))
      app.use(convert(history({})))
    }
  }
}
