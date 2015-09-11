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

thunk(function *() {
  console.log('Push last task')
  yield worker(function () {
    console.log('Last task')
  })

})()
