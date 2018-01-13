# WorkerStore

Redux like architecture inside WebWorker.
Reducers run inside Worker. In order to do that, dispatch must serializable values.
That is easiest way to communicate between the worker and main thread

### Create Store
```
// create store
const store = createStore( new Worker('./worker.js'));

// select state from the store
const mapStateToProps = ( {count, news}, ownProps) => ({
  count,
  news,
})

// connect component to the store
const App = connectWorker(mapStateToProps)( ({count, news, dispatch}) => {
    <div><h1>{count}</h1></div>
    <button onClick={dispatch('inc')}>+1</button>
    <button onClick={dispatch('dec')}>-1</button>
    <button onClick={dispatch('fetch', 5)}>fetch news</button>
})

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
```

---
### Inside Worker
Action returns whole new state or just part of it.
```
importScripts('./worker-import.js');

const initState = {
  count: 0,
  news: null
}

workerImport( initState, {
  inc: (state) => {count: state.count + 1},
  dec: (state) => {count: state.count - 1},
  fetch: (state, payload) => fetch('https://jsonplaceholder.typicode.com/posts/' + payload)
      .then( res => res.json())
      .then( json => ({news: json}))
})


```
