const Store = require('jfs')
const path = require('path')

module.exports = config => {
  if (!config) {
    config = {
      path: path.join(__dirname, '/.data/db/')
    }
  }

  const newsDb = new Store(config.path + 'news', { saveId: 'id' })

  const objectsToList = cb => {
    return (err, data) => {
      if (err) {
        cb(err, data)
      } else {
        cb(
          err,
          Object.keys(data).map(key => {
            return data[key]
          })
        )
      }
    }
  }

  const storage = {
    news: {
      get: (id, cb) => {
        newsDb.get(id, cb)
      },
      save: (data, cb) => {
        newsDb.save(data.id, data, cb)
      },
      delete: (id, cb) => {
        newsDb.delete(id, cb)
      },
      all: cb => {
        newsDb.all(objectsToList(cb))
      },
      allSync: () => {
        newsDb.allSync()
      },
      clear: () => {
        newsDb.all(
          objectsToList((err, data) => {
            if (err) {
              return
            }
            data.map(item => newsDb.delete(item.id))
          })
        )
      }
    }
  }

  return storage
}
