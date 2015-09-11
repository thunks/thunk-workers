'use strict'

var thunk = require('thunks')()
var worker = require('../index')()

'1234'.split('').forEach(function (id) {
  thunk(function *() {
    console.log('Push task', id)
    try {
      yield worker(function *() {
        yield thunk.delay(1000)
        if (id % 2 === 1) throw new Error('Error')
        console.log('Task', id, 'done')
      })
    } catch (e) {
      console.log('Task', id, 'error')
    }
  })()
})

console.log('Push normal funciton')
worker(function (callback) {
  console.log('Normal funciton task')
  if (true) throw new Error('someError')
  callback()
})(function (err) {
  console.log('Normal funciton Error', err)
})

console.log('Push last task')
worker(function (callback) {
  console.log('Last task')
  callback()
})()
