const express = require('express')
const path = require('path')
const app = express()
const compression = require('compression')
const fallback = require('express-history-api-fallback')

const publicPath = path.join(__dirname, 'public')

app.use(compression())
app.use(express.static(publicPath))
app.use(fallback('index.html', { root: publicPath }))

module.exports = app
