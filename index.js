'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT

const thunks = require('thunks')
const thunk = thunks()

module.exports = function thunkWorkers (count) {
  const workers = new Workers(count)
  return function workshop (task) {
    return thunk.call(this, function (callback) {
      if (typeof task !== 'function') {
        return callback(new TypeError(`Task "${task}" is not function!`))
      }
      workers.add(new Job(this, task, callback)).exec()
    })
  }
}

function Workers (count) {
  this.queue = []
  this.pending = 0
  this.count = count >= 1 ? Math.floor(count) : 1
}

Workers.prototype.add = function (job) {
  this.queue.push(job)
  return this
}

Workers.prototype.take = function () {
  return this.queue.shift()
}

Workers.prototype.exec = function () {
  if (this.pending >= this.count) return this

  const ctx = this
  const job = this.take()
  if (!job) return this

  this.pending++
  thunk.delay.call(job.ctx)(() => job.task)(function () {
    ctx.pending--
    ctx.exec()
    job.callback.apply(null, arguments)
  })
}

function Job (ctx, task, callback) {
  this.ctx = ctx
  this.task = toThunkableFn(task)
  this.callback = callback
}

function toThunkableFn (fn) {
  if (thunks.isThunkableFn(fn)) return fn
  return function (done) { thunk(fn.call(this))(done) }
}
