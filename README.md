<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Worker-Store](#worker-store)
  - [Installation](#installation)
  - [Documentaion](#documentaion)
  - [Usage](#usage)
  - [Inspiration](#inspiration)
  - [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Worker-Store

1kb state container running inside WebWorker.
A similar idea to Redux, besides the action-reducers run inside WebWorker.
To do that, dispatch sends only the name of the actions and payload.

## Installation

```sh
npm install --save worker-store
```

## [Documentaion](./docs)

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

Inside your web worker: store.worker.js

```js
import { runStore, put } from "worker-store/worker";

// runStore receive objet of actions
// every action receive current state as first parameter
// and rest as parameters from dispatch function
// action must return the next state  or part of it
runStore({
  inc: state => ({ count: state.count + 1 }),
  dec: state => ({ count: state.count - 1 }),
  // can return Promise which resolves into next state
  fetch: (state, payload) =>
    fetch("https://jsonplaceholder.typicode.com/posts/" + payload)
      .then(res => res.json())
      .then(json => ({ news: json })),
  // or generator function which yield next state
  generator: function*(state) {
    try {
      // using yield and put to update the state
      yield put({ status: "loading" });
      const response = yield fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const news = yield response.json();
      yield put({ news: news, status: "done" });
    } catch (err) {
      yield put({ status: "loaded", error: true });
    }
  }
});
```

## Inspiration

Inspired by
https://github.com/developit/unistore
https://github.com/developit/stockroom

## LICENSE

MIT
