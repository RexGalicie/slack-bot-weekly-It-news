const Botkit = require('botkit')

module.exports = config => {
  const storage = require('../files/index')
  const db = storage({
    path: config.rootPath
  })
  config.bot_options.json_file_store = config.rootPath // store user data in a simple JSON format

  // Create the Botkit controller, which controls all instances of the bot.
  const controller = Botkit.slackbot(config.bot_options)
  controller.startTicking()
  controller.storage.news = db.news
  return controller
}
