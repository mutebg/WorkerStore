export const createStore = (initState, worker) => {
  let listeners = []
  let lastState = initState

  const unsubscribe = listener => {
    let out = []
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        listener = null
      } else {
        out.push(listeners[i])
      }
    }
    listeners = out
  }

  const subscribe = listener => {
    listeners.push(listener);
    if ( lastState ) {
      listener(lastState);
    }
    return () => unsubscribe(listener)
  }

  worker.addEventListener('message', e => {
    lastState = e.data;
    listeners.forEach(listener => listener(e.data))
  })

  const dispatch = (actionName, ...args) => {
    worker.postMessage({actionName, args})
  }

  // dispatch initial state
  dispatch('@init', initState);

  const getState = () => lastState;


  return {
    getState,
    dispatch,
    subscribe,
  }
}
