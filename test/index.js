'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT

const assert = require('assert')
const tman = require('tman')
const thunk = require('thunks')()
const thunkWorkers = require('../index')

tman.suite('thunk-workers', function () {
  tman.it('Throw error with non-function task', function (done) {
    const workshop = thunkWorkers()
    workshop({})(function (err) {
      assert.strictEqual(err instanceof Error, true)
    })(done)
  })

  tman.it('Throw exception', function (done) {
    const workshop = thunkWorkers()
    workshop(function () {
      throw new Error('some error')
    })(function (err) {
      assert.strictEqual(err instanceof Error, true)
      assert.strictEqual(err.message, 'some error')
    })(done)
  })

  tman.it('Run task async', function (done) {
    let asyncRun = false
    const workshop = thunkWorkers()

    workshop(function () {
      assert.strictEqual(asyncRun, true)
      asyncRun = false
    })(function (err) {
      assert.strictEqual(err, null)
      assert.strictEqual(asyncRun, false)
    })(done)
    asyncRun = true
  })

  tman.it('Support sync task', function (done) {
    const workshop = thunkWorkers()

    workshop(function () {
      return 1
    })(function (err, res) {
      assert.strictEqual(err, null)
      assert.strictEqual(res, 1)
    })(done)
  })

  tman.it('Support custom context', function (done) {
    const workshop = thunkWorkers()
    const ctx = {}

    workshop.call(ctx, function () {
      assert.strictEqual(this, ctx)
    })(function (err) {
      assert.strictEqual(err, null)
      assert.strictEqual(this, ctx)
    })(done)
  })

  tman.it('Run task limited by workers', function (done) {
    this.timeout(5000)

    const workshop1 = thunkWorkers(2)
    const workshop2 = thunkWorkers(9)
    const jobs = []

    let max1 = 0
    let max2 = 0
    let threads1 = 0
    let threads2 = 0

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

    for (let i = 0; i < 100; i++) jobs.push(workshop1(task1))
    // should run well because they are thunk!
    for (let j = 0; j < 100; j++) jobs.push(workshop2(task2)())

    thunk.all(jobs)(function (err) {
      assert.strictEqual(err, null)
      assert.strictEqual(max1, 2)
      assert.strictEqual(max2, 9)
    })(done)
  })
})

try { // 检测是否支持 generator，是则加载 generator 测试
  let check = new Function('return function*(){}') // eslint-disable-line
  require('./generator.js')
} catch (e) {
  console.log('Not support generator!')
}
