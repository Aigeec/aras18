const express = require('express')
const router = express.Router()

const mongodb = require('../integrations/mongodb')
const twitter = require('../integrations/twitter')

router.get('/', (req, res) => {
  mongodb.connect.then(db => {
    db
      .collection('tweets')
      .find()
      .limit(20)
      .sort({ $natural: -1 })
      .toArray((err, doc) => {
        if (err) throw err
        res.json(doc.map(twitter.transformTweet))
      })
  })
})

module.exports = router
