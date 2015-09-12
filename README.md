# thunk-worker-queue
A [thunk](https://github.com/thunks/thunks)-based task queue manager.


Tasks can be pushed to in queue at the same time but running them one by one


## Demo([examples](https://github.com/thunks/thunk-worker-queue/blob/master/examples))

```javascript
'use strict'

const worker = require('thunk-worker-queue')()

'1234'.split('').forEach(function (id) {
  worker(function (callback) {
    console.log('Task ' + id + ' running')
    callback(null, id)
  })(function (error, result) {
    if (error) console.error(error)
    console.log('Task ' + result + ' done')
  })
})
```


## API

### require('thunk-worker-queue')(options)
Create a `Worker` queue
- `options` : {Object} includes:
  - `maxThread` : *Optional* max child thread allowed, Type: `Number`, Default `1`.


### Worker([function (callback)])
### Worker([function *])
Push a task function in the queue and run the task when any child thread is free. `callback` should be called to go next task if argument is a normal function.


Return a child thunk function
