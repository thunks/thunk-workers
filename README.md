# thunk-worker-queue

## Demo

```javascript
'use strict'

const thunk = require('thunks')()
const worker = require('thunk-worker-queue')()

'1234'.split('').forEach(function (id) {
  thunk(function *() {
    console.log('Push task', id)
    yield worker(function *() {
      console.log('Task', id, 'running')
      yield thunk.delay(1000)
    })
    console.log('Task', id, 'done')
  })()
})

thunk(function *() {
  console.log('Push last task')
  yield worker(function () {
    console.log('Last task')
  })
})()
```

## API

### require('thunk-worker-queue')(options)
Return a master `Worker`
- `options` : {Object} includes:
  - `maxThread` : {Number} max child thread allowed, default is `1`

### Worker([thunkable])
Push a task in the queue and run the task when any child thread is free.
Return a thunkable
