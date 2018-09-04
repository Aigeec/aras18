const WebSocket = require('ws')
const twitter = require('./integrations/twitter')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'aras18' })

module.exports = (server) => {
  const wss = new WebSocket.Server({ server })

  twitter.addListener((tweet) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(tweet)
      }
    })
  })

  wss.on('connection', (ws) => {
    twitter.getLatestTweet()
      .then(ws.send.bind(ws))
      .catch((error) => log.error(error))
  })
}
