import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'worker-store'
import {Provider, connect} from 'worker-store/react'
import Worker from './store.worker.js'

// create store
const initState = {count: 0, news: null, status: 'none'}
const store = createStore(initState, new Worker())

// using Kuker for debugging https://github.com/krasimir/kuker
store.subscribe(({state, action}) => {
  window.postMessage(
    {
      kuker: true,
      type: 'change state',
      origin: 'none',
      label: action,
      time: new Date().getTime(),
      state: state,
    },
    '*',
  )
})

// select state from the store
const mapStateToProps = (state, ownProps) => ({
  count: state.count,
  news: state.news,
  status: state.status,
})

function fibonacci(num) {
  if (num <= 1) return 1
  return fibonacci(num - 1) + fibonacci(num - 2)
}

// connect component to the store
const App = connect(mapStateToProps)(({count, news, status, dispatch}) => {
  return (
    <div>
      <button onClick={() => dispatch('inc')}>+1</button>
      <button onClick={() => dispatch('dec')}>-1</button>
      <button onClick={() => dispatch('delay')}>inc with delay</button>
      <h1>Couner: {count}</h1>

      <hr />

      <button onClick={() => dispatch('fetchNews', {id: 5})}>
        fetch news using Promise
      </button>
      <button onClick={() => dispatch('asyncGen')}>
        fetch news using Generator
      </button>
      <h3>
        Status: {status}, news: {JSON.stringify(news)}
      </h3>

      <hr />

      <p>
        Offload expensive work to a WebWorker might improve significant
        performance. In this example calculation fibonacci in main thread blocks
        UI, while doing that in web worker is perfectly fine. The webworker is
        doing all the works and just sends the result to UI thread.
      </p>

      <button onClick={() => dispatch('fib', 40)}>
        calculate fibonacci in worker
      </button>
      <button onClick={() => fibonacci(40)}>
        calculate fibonacci in main thread
      </button>

      <div className="anim" />
    </div>
  )
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
