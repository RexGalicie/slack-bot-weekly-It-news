const test = require('unit.js')
require('should')

const testObj0 = { id: 'TEST0', foo: 'bar0' }
const testObj1 = { id: 'TEST1', foo: 'bar1' }

describe('Files Storage', () => {
  const testStorageMethod = storageMethod => {
    describe('news.save', () => {
      it('should save data to file', () => {
        storageMethod.save(testObj0, err => {
          test.assert(!err)
        })
      })
    })

    describe('news.save', () => {
      it('should get data', () => {
        storageMethod.save(testObj1, err => {
          test.assert(!err)
          storageMethod.get(testObj1.id, (err, data) => {
            test.assert(!err)
            test.assert(data.foo === testObj1.foo)
          })
        })
      })
    })

    describe('news.get', () => {
      it('should not fount result', () => {
        storageMethod.save(testObj0, err => {
          test.assert(!err)
          storageMethod.get('shouldnt-be-here', (err, data) => {
            test.assert(err.displayName === 'NotFound')
            test.assert(!data)
          })
        })
      })
    })

    describe('news.all', () => {
      it('should get all data', () => {
        storageMethod.save(testObj0, function (err) {
          test.assert(!err)
        })
        storageMethod.save(testObj1, function (err) {
          test.assert(!err)
        })
        storageMethod.all(function (err, data) {
          test.assert(!err)
          test.assert(
            (data[0].foo === testObj0.foo && data[1].foo === testObj1.foo) ||
              (data[0].foo === testObj1.foo && data[1].foo === testObj0.foo)
          )
        })
      })
    })
  }

  // Test fileStore
  const fileStore = require('../../storage/files')()
  testStorageMethod(fileStore.news)
})
