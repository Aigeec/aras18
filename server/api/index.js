const express = require('express')
const router = express.Router()

const topTenMentions = require('./top-ten-mentions')

router.use('/top-ten-mentions', topTenMentions)

module.exports = router
