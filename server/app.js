const express = require('express')
const path = require('path')
const app = express()
const helmet = require('helmet')
const compression = require('compression')
const fallback = require('express-history-api-fallback')

const publicPath = path.join(__dirname, 'public')

const api = require('./api')

app.use(helmet())
app.use(compression())

app.use('/api', api)

app.use(express.static(publicPath), { maxAge: '30 days' })
app.use(fallback('index.html', { root: publicPath }))

module.exports = app
