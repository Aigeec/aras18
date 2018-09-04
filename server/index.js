const http = require('http')
const app = require('./app')

const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'aras18' })

const port = 6001
const server = http.createServer(app)

require('./websockets')(server)

server.listen(port, () => log.info(`#ARAS18 on port ${port}!`))
