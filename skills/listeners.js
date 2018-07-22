const memoryStore = require('../storage/memory')
const categories = require('../components/helpers/categories')

module.exports = controller => {
  controller.on('interactive_message_callback', (bot, message) => {
    categories.forEach(async category => {
      if (category.value === message.text) {
        const userId = message.user
        const linkObject = memoryStore[userId]
        linkObject.category = category
        const id = Buffer.from(linkObject.url).toString('base64')

        await controller.storage.news.save({
          id,
          userId,
          links: linkObject
        })
        bot.reply(
          message,
          `Saved link into ${category.text}: ${memoryStore[userId].title}`
        )
      }
    })
  })
}
