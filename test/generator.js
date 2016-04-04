'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT

var assert = require('assert')
var tman = require('tman')
var thunk = require('thunks')()
var thunkWorkers = require('../index')

tman.suite('thunk-workers with Promise and Generator', function () {
  tman.it('support Promise', function *() {
    var workshop = thunkWorkers()

    var res = yield workshop(function () {
      return Promise.resolve(1)
    })
    assert.strictEqual(res, 1)

    try {
      yield workshop(function () {
        return Promise.reject('error')
      })
    } catch (err) {
      assert.strictEqual(err, 'error')
    }
  })

  tman.it('support Generator function', function *() {
    var workshop = thunkWorkers()
    var time = Date.now()

    var res = yield workshop(function *() {
      yield thunk.delay(100)
      return yield Promise.resolve(1)
    })
    assert.strictEqual(res, 1)
    assert((time + 100) <= Date.now())

    res = yield workshop(function () {
      return function *() {
        return yield thunk(2)
      }
    })

    assert.strictEqual(res, 2)
  })
})
