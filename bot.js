const env = require('node-env-file')
const fs = require('fs')
const path = require('path')
const useTip = require('./components/helpers/logs')
require('debug')('botkit:main')

const envPath = path.join(__dirname, '/.env')
if (fs.existsSync(envPath)) {
  env(envPath)
}

if (!process.env.CLIENTID || !process.env.CLIENTSECRET || !process.env.PORT) {
  console.log('Error: Specify CLIENTID CLIENTSECRET and PORT in environment')
  useTip()
  process.exit(1)
}

const config = {
  bot_options: {
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    debug: process.env.DEBUG,
    scopes: ['bot']
  }
}

let controller = {}

if (process.env.STORAGE === 'mongo') {
  controller = require('./storage/connectors/mongo')(config)
} else {
  config.rootPath = path.join(__dirname, '/.data/db/')
  controller = require('./storage/connectors/file')(config)
}

// Set up an Express-powered webserver to expose oauth and webhook endpoints
require(path.join(__dirname, '/components/express_webserver.js'))(controller)

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(path.join(__dirname, '/components/user_registration.js'))(controller)

// Send an onboarding message when a new team joins
require(path.join(__dirname, '/components/onboarding.js'))(controller)

// All path where are hears && listeners
const normalizedPath = path.join(__dirname, 'skills')

fs.readdirSync(normalizedPath).forEach(file => {
  require('./skills/' + file)(controller)
})
