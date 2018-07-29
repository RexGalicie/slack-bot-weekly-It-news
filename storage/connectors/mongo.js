const Botkit = require('botkit')
const storage = require('../mongo')

module.exports = config => {
  const mongoStorage = storage({
    mongoUri: process.env.MONGODB_URI,
    tables: ['news']
  })
  config.bot_options.storage = mongoStorage
  // Create the Botkit controller, which controls all instances of the bot.
  const controller = Botkit.slackbot(config.bot_options)
  controller.startTicking()
  return controller
}
