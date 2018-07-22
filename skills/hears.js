const urlRegex = require('url-regex')
const fetch = require('node-fetch')
const ent = require('ent')
const groupBy = require('lodash/groupBy')
const categories = require('../components/helpers/categories')
const memoryStore = require('../storage/memory')

module.exports = controller => {
  // regexs
  const titleRegex = /<title(.+?)<\/title>/gim
  const generateMarkdown = () => {
    const sanitizeTitle = title => title.replace(/[\n\r\t]+/gm, ' ')
    return new Promise((resolve, reject) => {
      controller.storage.news.all((err, data) => {
        if (err) {
          reject(err)
        }
        const groupedLinks = groupBy(data, it => it.links.category.text)
        const markdown = categories
          .map(category => {
            const header = `\n## ${category.text}\n`
            const links = groupedLinks[category.text]
              ? groupedLinks[category.text]
                .map(
                  group =>
                    `- [${sanitizeTitle(group.links.title)}](${group.links.url})\n`
                )
                .reduce((acc, val) => acc + val, '')
              : ' - No links yet\n'
            return `${header}${links}`
          })
          .reduce((acc, val) => acc + val, '')
        resolve(markdown)
      })
    })
  }

  controller.hears(
    ['generate preview'],
    'direct_message,direct_mention,mention',
    async (bot, message) => {
      try {
        const markdown = await generateMarkdown()
        bot.reply(message, {
          text: markdown,
          unfurl_links: false,
          unfurl_media: false
        })
      } catch (e) {
        bot.reply(message, {
          text: 'Error',
          unfurl_links: false,
          unfurl_media: false
        })
      }
    }
  )

  controller.hears(
    ['new list'],
    'direct_message,direct_mention,mention',
    async (bot, message) => {
      try {
        await controller.storage.news.clear()
        bot.reply(message, {
          text: 'Success clear list',
          unfurl_links: false,
          unfurl_media: false
        })
      } catch (e) {
        bot.reply(message, {
          text: 'Error',
          unfurl_links: false,
          unfurl_media: false
        })
      }
    }
  )

  controller.hears(
    [urlRegex()],
    'direct_message,direct_mention,message_received',
    async (bot, message) => {
      const re = />$/
      const urls = message.match
      const firstUrl = urls[0].replace(re, '')
      const body = await fetch(firstUrl).then(r => r.text())
      const titleTag = body.match(titleRegex)
      const title = ent.decode(
        />(.+)/.exec(titleTag.pop().replace('<title', '').replace('</title>', ''))[1]
      )
      // // get userId
      const userId = message.user
      memoryStore[userId] = { url: firstUrl, title, category: '' }

      bot.reply(message, {
        attachments: [
          {
            title: 'What category should it be',
            callback_id: 'set_to_category',
            attachment_type: 'default',
            actions: [
              {
                name: 'category_selection',
                text: 'Pick a category...',
                type: 'select',
                options: categories
              }
            ]
          }
        ]
      })
    }
  )
}
