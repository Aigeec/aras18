const express = require('express')
const router = express.Router()

const topTenMentions = require('./top-ten-mentions')
const recentTweets = require('./recent-tweets')

router.use('/top-ten-mentions', topTenMentions)
router.use('/recent-tweets', recentTweets)

module.exports = router
