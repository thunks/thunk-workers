'use strict'

var thunk = require('thunks')()
var thunkWorkers = require('../index')
var workshop = thunkWorkers(2)

for (var i = 1; i <= 10; i++) addWork(i)

function addWork (id) {
  workshop(function () {
    console.log('Task ' + id + ' start:')

    var timer = setInterval(function () {
      process.stdout.write(String(id))
    }, 50)

    var time = 200 + Math.floor(1000 * Math.random())
    if (id === 10) time = 10

    return thunk.delay(time)(function () {
      clearInterval(timer)
      return time
    })
  })(function (error, res) {
    console.log(error || ('\nTask ' + id + ' finished, ' + res + ' ms.'))
  })
}

// lazy evaluation
var job = workshop(function () {
  console.log('Lazy evaluation!')
  throw new Error('some error!')
})

// sync task
workshop(function () {
  console.log('Run sync task')
})(function (error, res) {
  console.log(error || 'Sync task finished!')
})

// async task
workshop(function () {
  return function (callback) {
    setTimeout(function () {
      console.log('Run async task')
      callback()
    }, 100)
  }
})(function (error, res) {
  console.log(error || 'Async task finished!')
})

job(function (err) {
  console.log('lazy job has error:', err)
})
