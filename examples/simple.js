'use strict'

const worker = require('../index')()

'1234'.split('').forEach(function (id) {
  worker(function (callback) {
    console.log('Task ' + id + ' running')
    callback(null, id)
  })(function (error, result) {
    if (error) console.error(error)
    console.log('Task ' + result + ' done')
  })
})
