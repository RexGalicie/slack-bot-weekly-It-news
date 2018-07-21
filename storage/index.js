var Store = require('jfs');

module.exports = config => {
  if (!config) {
    config = {
      path: __dirname + '/.data/db/'
    };
  }

  var news_db = new Store(config.path + 'news', { saveId: 'id' });

  var objectsToList = cb => {
    return (err, data) => {
      if (err) {
        cb(err, data);
      } else {
        cb(
          err,
          Object.keys(data).map(key => {
            return data[key];
          })
        );
      }
    };
  };

  var storage = {
    news: {
      get: (id, cb) => {
        news_db.get(id, cb);
      },
      save: (data, cb) => {
        news_db.save(data.id, data, cb);
      },
      delete: (id, cb) => {
        news_db.delete(id, cb);
      },
      all: cb => {
        news_db.all(objectsToList(cb));
      },
      allSync: () => {
        news_db.allSync();
      }
    }
  };

  return storage;
};
