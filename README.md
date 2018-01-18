* [Worker-Store](#worker-store)
  * [Installation](#installation)
  * [Documentaion](#documentaion)
  * [Usage](#usage)
  * [Inspiration](#inspiration)
  * [LICENSE](#license)

# Worker-Store

1kb state container running inside a WebWorker.
A similar idea to Redux, besides the action-reducers run inside WebWorker.
To do that, dispatch sends only the name of the actions and payload.
That is the easiest way to achieve communication between the worker and main thread.

## Installation

```sh
npm install --save worker-store
```

## Documentaion

* Getting started
* API

  * [createStore][#createstore]
  * [dispatch][#dispatch]
  * [Provider][#provider]
  * [connect][#connect]
  * [runStore][#runstore]
  * [put][#put]

* Examples
  * Vanilla
  * React
  * Preact

## Usage

You need worker loader, something like https://github.com/webpack-contrib/worker-loader

In your app.js

```js
import { createStore } from 'worker-store';
import { Provider, connect  } from 'worker-store/react';
import Worker from './store.worker.js';

// initial store state
const initState = {count: 0, news: []};

// create store
const store = createStore( initState , new Worker() );

// Select state from the store
const mapStateToProps = ( state, ownProps) => ({
    count: state.count,
    news: state.news,
});

//Connects React/Preact component to the store.
const App = connect(mapStateToProps)(({count, news, dispatch}) => {
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={ () => dispatch('inc')}>+1</button>
      <button onClick={ () => dispatch('dec')}>-1</button>
      <button onClick={ () => dispatch('fetch', 5)}>fetch news</button>
      <button onClick={ () => dispatch('generator')}>generator</button>
    </div>
  )
});

// Makes the store available to the connect() calls in the component hierarchy below.
export default () => (
  <Provider store={store}>
    <App />
  </Provider>,
)
```

Inside your store.worker.js

```js
import { runStore, put } from "worker-store/worker";

runStore({
  inc: state => ({ count: state.count + 1 }),
  dec: state => ({ count: state.count - 1 }),
  fetch: (state, payload) =>
    fetch("https://jsonplaceholder.typicode.com/posts/" + payload)
      .then(res => res.json())
      .then(json => ({ news: json })),
  generator: function*(state) {
    try {
      // using yield put to update the state
      yield put({ status: "loading" });
      const response = yield fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const news = yield response.json();
      // using yield put to update the state
      yield put({ news: news });
      yield put({ status: "done" });
    } catch (err) {
      yield put({ status: "loaded", error: true });
    }
  }
});
```

## Inspiration

Inspired by https://github.com/developit/unistore

## LICENSE

MIT
