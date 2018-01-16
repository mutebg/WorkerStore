# Worker-Store

Global state container running inside a WebWorker.
A similar idea to Redux, besides the "reducers" run inside WebWorker.
To do that, dispatch sends only the name of the actions and payload.
That is the easiest way to achieve communication between the worker and main thread.

## Installation

```
npm install --save worker-store
```

## Documentaion

* Getting started
* API

  * createStore
  * runStore
  * put
  * Provider, connect ( React, Preact integration )

* Examples
  * Vanilla JS
  * React
  * Preact

## Usage

You need worker loader, something like https://github.com/webpack-contrib/worker-loader

In your app.js

```
import { createStore } from 'worker-store';
import { Provider, connect  } from 'worker-store/react';
import Worker from './store.worker.js';

// create store
const initState = {count: 0, news: []};
const store = createStore( initState , new Worker() );

// select state from the store
const mapStateToProps = ( state, ownProps) => ({
    count: state.count,
    news: state.news,
});

// connect component to the store
const App = connect(mapStateToProps)(({count, news, dispatch}) => {
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={ () => dispatch('inc')}>+1</button>
      <button onClick={ () => dispatch('dec')}>-1</button>
      <button onClick={ () => dispatch('fetch', 5)}>fetch news</button>
    </div>
  )
});

export default () => (
  <Provider store={store}>
    <App />
  </Provider>,
)
```

Inside your store.worker.js

```
import { runStore, put } from 'worker-store/worker';

runStore({
  inc: (state) => ({count: state.count + 1}),
  dec: (state) => ({count: state.count - 1}),
  fetch: (state, payload) => fetch('https://jsonplaceholder.typicode.com/posts/' + payload)
      .then( res => res.json())
      .then( json => ({news: json})),
  generator: function*(state) {
    try {
      yield put({ status: "loading" });
      const response = yield fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const news = yield response.json();
      yield put({ news: news });
      yield put({ status: "done" });
    } catch (err) {
      yield put({status: "loaded", error: true });
    }
  }
})
```

## Inspiration

Inspired by https://github.com/developit/unistore

## LICENSE

MIT
