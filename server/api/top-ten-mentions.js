const express = require('express')
const router = express.Router()

const mongodb = require('../integrations/mongodb')

router.get('/', (req, res) => {
  mongodb.connect.then(db => {
    db.collection('userMentions').aggregate([
      { $group: { _id: '$screen_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray((err, doc) => {
      if (err) throw err
      res.json(doc)
    })
  })
})

module.exports = router
