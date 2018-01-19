# Documentation

* Getting started
* [API](#api)
  * [createStore][#createstore]
  * [dispatch][#dispatch]
  * [Provider][#provider]
  * [connect][#connect]
  * [runStore][#runstore]
  * [put][#put]
* Examples

## API

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

1. action function name
2. payload to action function

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

### runStore

Object with actions
Every action acceps current state and parameters passed from dispatch function

### put

Can be used inside generator to update state
**Parameters**

* new state **[object]**
