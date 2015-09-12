'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT

var thunk = require('thunks')()

module.exports = function thunkWorkers (count) {
  var workers = new Workers(count)
  return function workshop (task) {
    return thunk.call(this, function (callback) {
      if (typeof task !== 'function') {
        return callback(new Error('Task "' + String(task) + '" is not function!'))
      }
      workers.add(new Job(this, task, callback)).exec()
    })
  }
}

function Workers (count) {
  this.queue = []
  this.pending = 0
  this.count = count >= 1 ? +count : 1
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

  var ctx = this
  var job = this.take()
  if (!job) return this

  this.pending++
  thunk.delay()(function () {
    return job.task.call(job.ctx)
  })(function () {
    ctx.pending--
    ctx.exec()
    job.callback.apply(null, arguments)
  })
}

function Job (ctx, task, callback) {
  this.ctx = ctx
  this.task = task
  this.callback = callback
}
