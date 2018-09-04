const express = require('express')
const path = require('path')
const app = express()
const compression = require('compression')

app.use(compression())
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app
