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
      thunk.delay()(flushQueue)()
      if (err) throw err
      return arguments.length > 2 ? slice(arguments) : res
    })(job.callback)
  }

  function Worker (task) {
    return thunk.call(this, function (callback) {
      if (typeof task !== 'function') {
        throw new Error('Task "' + String(task) + '" is not function!')
      }
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

function slice (args, start) {
  var len = args.length
  start = start || 0
  if (start >= len) return []

  var ret = Array(len - start)
  while (len-- > start) ret[len - start] = args[len]
  return ret
}
