<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Documentation](#documentation)
  - [Main thread API](#main-thread-api)
  - [WebWorker API](#webworker-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Documentation

##  Main thread API

### createStore(initialState, worker)

Create store

**Arguments**

1. Initial store state **[object]**
2. WebWorker instance
   **Returns**
   Store object which is responble for the state of your app

**Example**

```js
import { createStore } from "worker-store";
const initState = { count: 0, news: [] };
const store = createStore({}, new Worker());

store.dispatch("INCREMENT");
store.subscribe(state => console.log("new state", state));
```

### `dispatch(action, payload)`

Dispatches an action is the only way to trigger a state change.

**Arguments**

1. Action name
2. Payload

**Example**

```js
connect()( ({dispatch}) => <button onClick={ dispatch('FETCH_NEWS' {id: 10})} )
```

### Provider

Makes the store available to the connect() calls in the component hierarchy below.

**Example**

```js
<Provider store={store}>
  <MyComponent />
</Provider>
```

### connect

Connects a React/Preact component to the store.

**Arguments**

1. [mapStateToProps(state, [ownProps]): stateProps](Function): If this argument is specified, the new component will subscribe to store updates. This means that any time the store is updated, mapStateToProps will be called. The results of mapStateToProps must be a plain object, which will be merged into the component’s props. If you don't want to subscribe to store updates, pass null or undefined in place of mapStateToProps.

```js
const mapStateToProps = ( state, ownProps) => ({
    count: state.count,
});
const App = connect(mapStateToProps)(({count}) => <h1>{count}/h1>);
```

## WebWorker API

### runStore

Object with actions. Every action accepts current state and parameters passed from dispatch function

### put

Can be used inside generator to update state

**Parameters**

* new state **[object]**
