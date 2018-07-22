const monk = require('monk')

module.exports = config => {
  if (!config || !config.mongoUri) {
    throw new Error('Need to provide mongo address.')
  }

  const db = monk(config.mongoUri, config.mongoOptions)

  db.catch(err => {
    throw new Error(err)
  })

  const storage = {}
  const tables = ['teams', 'channels', 'users']
  // if config.tables, add to the default tables
  config.tables &&
    config.tables.forEach(table => {
      if (typeof table === 'string') tables.push(table)
    })

  tables.forEach(zone => {
    storage[zone] = getStorage(db, zone)
  })

  return storage
}

const getStorage = (db, zone) => {
  const table = db.get(zone)
  return {
    get: (id, cb) => table.findOne({ id: id }, cb),
    save: (data, cb) =>
      table.findOneAndUpdate(
        { id: data.id },
        data,
        { upsert: true, returnNewDocument: true },
        cb
      ),
    all: cb => table.find({}, cb),
    find: (data, cb) => table.find(data, cb),
    delete: (id, cb) => table.findOneAndDelete({ id: id }, cb),
    clear: cb => table.remove({}, cb)
  }
}
