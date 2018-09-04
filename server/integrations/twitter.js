const Twitter = require('twitter')
const awsComprehend = require('./aws-comprehend')
const mongodb = require('./mongodb')
const twitterText = require('twitter-text')
const backoff = require('backoff')
const config = require('config')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'aras18' })

let lastTweet
const listeners = []

const topics = config.get('twitter.topics')
log.debug(`Topics: ${topics.join(',')}`)
const follow = config.get('twitter.follow')
log.debug(`Following: ${follow.join(',')}`)

var client = new Twitter(config.get('twitter.auth'))

function transformTweet (enrichedTweet) {
  return JSON.stringify({
    text: twitterText.autoLink(twitterText.htmlEscape(getTweetText(enrichedTweet.tweet))),
    created_at: enrichedTweet.tweet.created_at,
    displayName: enrichedTweet.tweet.user.name,
    username: enrichedTweet.tweet.user.screen_name,
    userProfilePic: enrichedTweet.tweet.user.profile_image_url_https,
    sentiment: enrichedTweet.sentiment,
    retweeted: enrichedTweet.tweet.retweeted
  })
}

function getTweetText (tweet) {
  return tweet.truncated && tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text
}

function getTweetSentiment (tweet) {
  return awsComprehend.detectSentiment(tweet.text).then((sentiment) => {
    return {
      id: tweet.id_str,
      created_at: new Date(tweet.created_at),
      tweet,
      sentiment
    }
  })
}

function persistTweet (enrichedTweet) {
  return mongodb.connect.then((db) =>
    db.collection('tweets')
      .insertOne(enrichedTweet).then(() => enrichedTweet))
}

function handleTweet (tweet) {
  lastTweet = getTweetSentiment(tweet)
    .then(persistTweet)
    .then(transformTweet)
    .then((transformedTweet) => {
      listeners.forEach((listener) => listener(transformedTweet))
      return transformedTweet
    }).catch((err) => {
      log.error(`Could not process tweet [${tweet.id}]`, err)
    })
  return lastTweet
}

function getLatestTweet () {
  lastTweet = client.get('search/tweets', { q: `${topics.concat(follow).map((item) => encodeURIComponent(item)).join(' OR ')}`, result_type: 'recent', count: 1 })
    .then((tweets) => {
      if (!tweets.statuses || tweets.statuses.length === 0) {
        throw new Error('Did not retrieve any tweets. Will try again.')
      }
      return handleTweet(tweets.statuses[0])
    })
    .catch((err) => {
      log.error('Error during getLatestTweet', err)
      setTimeout(getLatestTweet, 5000)
    })
}

const streamBackoff = backoff.exponential({
  initialDelay: 1000,
  maxDelay: 300000
})

function startStream () {
  log.info('Connection to Twitter stream')
  var stream = client.stream('statuses/filter', { track: topics.concat(follow).join(',') })

  stream.on('response', () => {
    log.info('Connected to Twitter stream')
    streamBackoff.reset()
  })

  stream.on('data', (event) => {
    handleTweet(event)
  })

  stream.on('error', (err) => {
    log.warn('Error connecting to Twitter stream', err)
  })

  stream.on('end', () => {
    log.warn('Twitter stream ended')
    streamBackoff.backoff()
  })
}

streamBackoff.on('ready', (number, delay) => {
  log.warn(`Reconnection attempt ${number} next attempt in ${delay}ms`)
  startStream()
})

getLatestTweet()
startStream()

module.exports.addListener = (listener) => {
  listeners.push(listener)
}

module.exports.getLatestTweet = () => lastTweet
