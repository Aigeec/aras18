const config = require('config')
const MongoClient = require('mongodb').MongoClient
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'aras18' })

// Connection URL
const url = config.get('mongo.url')

// Database Name
const dbName = config.get('mongo.dbName')

// Use connect method to connect to the server
module.exports.connect = new Promise((resolve, reject) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      reject(err)
    } else {
      log.info('Connected successfully to Mongo server')
      resolve(client.db(dbName))
    }
  })
})
