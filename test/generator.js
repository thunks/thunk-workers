'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT

const assert = require('assert')
const tman = require('tman')
const thunk = require('thunks')()
const thunkWorkers = require('../index')

tman.suite('thunk-workers with Promise and Generator', function () {
  tman.it('support Promise', function * () {
    const workshop = thunkWorkers()

    let res = yield workshop(function () {
      return Promise.resolve(1)
    })
    assert.strictEqual(res, 1)

    try {
      yield workshop(function () {
        return Promise.reject(new Error('error'))
      })
    } catch (err) {
      assert.strictEqual(err.message, 'error')
    }
  })

  tman.it('support Generator function', function * () {
    const workshop = thunkWorkers()
    let time = Date.now()

    let res = yield workshop(function * () {
      yield thunk.delay(100)
      return yield Promise.resolve(1)
    })
    assert.strictEqual(res, 1)
    assert((time + 100) <= Date.now())

    res = yield workshop(function () {
      return function * () {
        return yield thunk(2)
      }
    })

    assert.strictEqual(res, 2)
  })
})
