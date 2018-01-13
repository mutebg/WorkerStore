import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from '../../../src/index'
import {Provider, connect} from '../../../src/integrations/react'

// create store
const store = createStore(new Worker('./worker.js'))

// select state from the store
const mapStateToProps = ({count, news}, ownProps) => ({
  count,
  news,
})

// connect component to the store
const App = connect(mapStateToProps)(({count, news, dispatch}) => {
  ;<div>
    <div>
      <h1>{count}</h1>
    </div>
    <button onClick={dispatch('inc')}>+1</button>
    <button onClick={dispatch('dec')}>-1</button>
    <button onClick={dispatch('fetch', 5)}>fetch news</button>
  </div>
})

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'))
