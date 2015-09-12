'use strict'

var thunk = require('thunks')()
var worker = require('../index')()

function * pushTask (id) {
  // Push a generator task to worker
  console.log('Push generator task', id)
  yield worker(function *() {
    yield thunk.delay(500)
  })
  console.log('Task', id, 'done')
}

function * pushTaskWithError () {
  console.log('Push generator task with error')
  try {
    yield worker(function *() {
      yield thunk.delay(500)
      throw new Error('Error')
    })
  } catch (e) {
    // Use try-catch to catch error in task
    console.error('Task error')
  }
}

for (let i = 0; i < 5; i++) {
  thunk(pushTask(i))()
}

thunk(pushTaskWithError())()

// Push a non-function to worker and throw an error
console.log('Push Object to worker')
worker({})(function (err, res) {
  if (err) console.error(err)
})

// Push a normal function to the worker and callback should be called
// NOTICE: a child-thunk-function returned by the worker and should be called.
console.log('Push normal function')
worker(function (callback) {
  console.log('Normal function task done and callback should be called')
  callback()
})()

// some error thrown out during worker runing task
console.log('Push normal funciton with error')
worker(function (callback) {
  throw new Error('Normal funciton error')
})(function (err) {
  console.error(err)
})

