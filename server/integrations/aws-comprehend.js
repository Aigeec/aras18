const AWS = require('aws-sdk')
const config = require('config')

AWS.config = new AWS.Config(config.get('aws'))

var comprehend = new AWS.Comprehend()

module.exports.detectSentiment = (text) => {
  var params = {
    LanguageCode: 'en',
    Text: text
  }
  if (config.get('analyseSentiment')) {
    return new Promise((resolve, reject) => {
      comprehend.detectSentiment(params, function (err, data) {
        if (err) reject(err) // an error occurred
        else resolve(data) // successful response
      })
    })
  } else {
    return Promise.resolve({})
  }
}
