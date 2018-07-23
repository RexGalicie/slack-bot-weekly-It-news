require('should')

const sinon = require('sinon')

const proxyquire = require('proxyquire').noCallThru()

require('should-sinon')

describe('Mongo Storage', () => {
  let monkMock
  let collectionMock
  let collectionObj
  let Storage
  let config

  beforeEach(() => {
    config = { mongoUri: 'http://someurl.somewhere.com' }

    collectionObj = {
      find: sinon.stub(),
      remove: sinon.stub(),
      findOne: sinon.stub(),
      findOneAndUpdate: sinon.stub(),
      findOneAndDelete: sinon.stub()
    }

    collectionMock = {
      get: sinon.stub().returns(collectionObj)
    }

    monkMock = sinon.stub().returns(collectionMock)

    Storage = proxyquire('../../storage/mongo', { monk: monkMock })
  })

  describe('Initialization', () => {
    it('should throw an error if config is missing', () => {
      Storage.should.throw('Need to provide mongo address.')
    })

    it('should throw an error if mongoUri is missing', () => {
      (() => {
        Storage({})
      }).should.throw('Need to provide mongo address.')
    })

    it('should initialize monk with mongoUri', () => {
      Storage(config)
      monkMock.callCount.should.equal(1)
      monkMock.args[0][0].should.equal(config.mongoUri)
    })
  });

  ['teams', 'channels', 'users'].forEach(method => {
    describe(method + '.get', () => {
      it('should call findOne with callback', () => {
        const cb = sinon.stub()

        Storage(config)[method].get('walterwhite', cb)
        collectionObj.findOne.should.be.calledWith({ id: 'walterwhite' }, cb)
      })
    })

    describe(method + '.save', () => {
      it('should call findOneAndUpdate', () => {
        const data = { id: 'walterwhite' }
        const cb = sinon.stub()

        Storage(config)[method].save(data, cb)
        collectionObj.findOneAndUpdate.should.be.calledWith(
          { id: 'walterwhite' },
          data,
          { upsert: true, returnNewDocument: true },
          cb
        )
      })
    })

    describe(method + '.all', () => {
      it('should call find', () => {
        const cb = sinon.stub()

        Storage(config)[method].all(cb)
        collectionObj.find.should.be.calledWith({}, cb)
      })
    })

    describe(method + '.delete', () => {
      it('should call findOneAndDelete', () => {
        const id = 'walterwhite'
        const cb = sinon.stub()

        Storage(config)[method].delete(id, cb)
        collectionObj.findOneAndDelete.should.be.calledWith({ id: 'walterwhite' }, cb)
      })
    })

    describe(method + '.clear', () => {
      it('should call clear', () => {
        const cb = sinon.stub()

        Storage(config)[method].clear(cb)
        collectionObj.remove.should.be.calledWith({}, cb)
      })
    })
  })
})
