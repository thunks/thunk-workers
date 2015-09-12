'use strict'
/* global describe, it */

const thunk = require('thunks')()
const ThunkWorkerQueue = require('../')
const assert = require('assert')

describe('thunk-worker-queue', function () {
  it('Limit process running', function (callback) {
    var maxThread = 1
    var worker = ThunkWorkerQueue({maxThread: maxThread})

    var threads = 0
    var task = function *() {
      yield thunk.delay(100)
      threads++
      assert.ok(threads <= maxThread, 'threads should less than max threads')
      threads--
    }

    for (let i = 0; i < 10; i++) {
      thunk.delay(0)(function *() {
        yield worker(task)
      })()
    }

    thunk.delay(100)(function *() {
      yield worker(function *() {
        callback()
      })
    })()
  })
})
