'use strict'

const thunk = require('thunks')()
const thunkWorkers = require('../index')
const workshop = thunkWorkers(2)

for (let i = 1; i <= 10; i++) addWork(i)

function addWork (id) {
  workshop(function () {
    console.log('Task ' + id + ' start:')

    let timer = setInterval(function () {
      process.stdout.write(String(id))
    }, 50)

    let time = 200 + Math.floor(1000 * Math.random())
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
const job = workshop(function () {
  console.log('Lazy evaluation!')
  throw new Error('some error!')
})

// sync task
workshop(function () {
  console.log('Run sync task')
})(function (error, res) {
  console.log(error || 'Sync task finished!')
})

// thunk task
workshop(function (callback) {
  setTimeout(function () {
    console.log('Run thunk task')
    callback()
  }, 100)
})(function (error, res) {
  console.log(error || 'Thunk task finished!')
})

// generator task
workshop(function * () {
  yield thunk.delay(100)
  console.log('Run generator task')
})(function (error, res) {
  console.log(error || 'Generator task finished!')
})

job(function (err) {
  console.log('lazy job has error:', err)
})
