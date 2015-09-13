'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT
/* global describe, it */

var assert = require('assert')
var thunk = require('thunks')()
var thunkWorkers = require('../index')

describe('thunk-workers', function () {
  it('Throw error with non-function task', function (done) {
    var workshop = thunkWorkers()
    workshop({})(function (err) {
      assert.strictEqual(err instanceof Error, true)
    })(done)
  })

  it('Throw exception', function (done) {
    var workshop = thunkWorkers()
    workshop(function () {
      throw new Error('some error')
    })(function (err) {
      assert.strictEqual(err instanceof Error, true)
      assert.strictEqual(err.message, 'some error')
    })(done)
  })

  it('Run task async', function (done) {
    var async = false
    var workshop = thunkWorkers()

    workshop(function () {
      assert.strictEqual(async, true)
      async = false
    })(function (err) {
      assert.strictEqual(err, null)
      assert.strictEqual(async, false)
    })(done)
    async = true
  })

  it('Support sync task', function (done) {
    var workshop = thunkWorkers()

    workshop(function () {
      return 1
    })(function (err, res) {
      assert.strictEqual(err, null)
      assert.strictEqual(res, 1)
    })(done)
  })

  it('Support custom context', function (done) {
    var workshop = thunkWorkers()
    var ctx = {}

    workshop.call(ctx, function () {
      assert.strictEqual(this, ctx)
    })(function (err) {
      assert.strictEqual(err, null)
      assert.strictEqual(this, ctx)
    })(done)
  })

  it('Run task limited by workers', function (done) {
    var workshop1 = thunkWorkers(2)
    var workshop2 = thunkWorkers(9)
    var jobs = []
    var max1 = 0
    var max2 = 0
    var threads1 = 0
    var threads2 = 0

    function task1 () {
      threads1++
      max1 = Math.max(threads1, max1)
      assert(threads1 <= 2)
      return thunk.delay(100 * Math.random())(function () {
        threads1--
      })
    }

    function task2 () {
      threads2++
      max2 = Math.max(threads2, max2)
      assert(threads2 <= 9)
      return thunk.delay(100 * Math.random())(function () {
        threads2--
      })
    }

    for (var i = 0; i < 100; i++) jobs.push(workshop1(task1))
    // should run well because they are thunk!
    for (var j = 0; j < 100; j++) jobs.push(workshop2(task2)())

    thunk.all(jobs)(function (err) {
      assert.strictEqual(err, null)
      assert.strictEqual(max1, 2)
      assert.strictEqual(max2, 9)
    })(done)
  })
})

try { // 检测是否支持 generator，是则加载 generator 测试
  var check = new Function('return function*(){}') // eslint-disable-line
  require('./generator.js')
} catch (e) {
  console.log('Not support generator!')
}
