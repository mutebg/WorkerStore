# Documentation

- Getting started
-   [API](#api)
    - [createStore][#createstore]
    - [dispatch][#dispatch]
    - [Provider][#provider]
    - [connect][#connect]
    - [runStore][#runstore]
    - [put][#put]
- Examples

## API

### createStore
Create store

**Parameters**
- Initial store  state **[object]**
- WebWorker instance
Returns **store instance**


### dispatch
Dispatch action to the store inside WebWorker
**Parameters**
- Action name **[string]**
- Rest parameters been passed to action **[any]**  


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


### runStore
Object with actions
Every action acceps current state and parameters passed from dispatch function 


### put
Can be used inside generator to update state
**Parameters**
- new state **[object]**
