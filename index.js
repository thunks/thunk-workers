'use strict'

var thunk = require('thunks')()

module.exports = function (options) {
  options = options || {}

  var maxThread = options.maxThread || 1
  var pending = 0
  var queue = []

  return Worker

  function flushQueue () {
    if (pending >= maxThread || !queue.length) return
    var job = queue.shift()
    pending++

    thunk.call(job.ctx, job.task)(function (err, res) {
      pending--
      flushQueue()
      if (err) throw err
      return res
    })(job.callback)
  }

  function Worker (task) {
    if (typeof task !== 'function') {
      throw new Error('Task "' + String(task) + '" is not function!')
    }
    return thunk.call(this, function (callback) {
      queue.push(new Job(this, task, callback))
      flushQueue()
    })
  }
}

function Job (ctx, task, callback) {
  this.ctx = ctx
  this.task = task
  this.callback = callback
}
