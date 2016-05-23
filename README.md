thunk-workers
====
Thunk-based task scheduler that executes synchrounous and/or asynchronous tasks under concurrency control.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

## [thunks](https://github.com/thunks/thunks)

## Demo

```js
var thunk = require('thunks')()
var thunkWorkers = require('thunk-workers')
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

// Result:
// Task 1 start:
// Task 2 start:
// 121212121212121212
// Task 2 finished, 510 ms.
// Task 3 start:
// 13131313131313131
// Task 1 finished, 981 ms.
// Task 4 start:
// 343434343434343434343434343
// Task 3 finished, 1199 ms.
// Task 5 start:
// 45454545454
// Task 4 finished, 1031 ms.
// Task 6 start:
// 565656565656565656
// Task 6 finished, 485 ms.
// Task 7 start:
// 5757575757
// Task 5 finished, 1072 ms.
// Task 8 start:
// 78787878787
// Task 8 finished, 317 ms.
// Task 9 start:
// 7979797979
// Task 7 finished, 886 ms.
// Task 10 start:
// Task 9 finished, 284 ms.
// Task 10 finished, 10 ms.
```

## API

```js
var thunkWorkers = require('thunk-workers')
```

### thunkWorkers([count])

Create a workshop that limits the number of concurrent tasks being executed.

- `count`: {Number} Maximum number of task threads being executed concurrently. Default to `1`.

```js
var workshop = thunkWorkers(5)
```

### workshop(task)

Return a thunk function that executes a specific task. Tasks are queued by the time the returned thunk function is executed. Once the number of concurrent tasks is within workshop's limitation, a task is polled from the queue and executed.

- `task`: {Function} Support sync task or async task, task must be a function or a generator function. Async task should be generator function, or return a [thunkable](https://github.com/thunks/thunks) value, such as thunk function, promise, generator function, generator object.

```js
var job = workshop(function () {
  return function (callback) {
    setTimeout(function () {
      callback(null, 'Async task')
    }, 100)
  }
})

job(function (err, res) {
  console.log(err, res)
})

// Support Promise
workshop(function () {
  return Promise.resolve('promise')
})(function (err, res) {
  console.log(err, res)
})
//Support Generator function
workshop(function *() {
  return yield function (callback) {
    setTimeout(function () {
      callback(null, 'Generator task')
    }, 100)
  }
})(function (err, res) {
  console.log(err, res)
})
```

[npm-url]: https://npmjs.org/package/thunk-workers
[npm-image]: http://img.shields.io/npm/v/thunk-workers.svg

[travis-url]: https://travis-ci.org/thunks/thunk-workers
[travis-image]: http://img.shields.io/travis/thunks/thunk-workers.svg

[downloads-url]: https://npmjs.org/package/thunk-workers
[downloads-image]: http://img.shields.io/npm/dm/thunk-workers.svg?style=flat-square
