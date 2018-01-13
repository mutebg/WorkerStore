export const createStore = worker => {
  let listeners = []

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
    listeners.push(listener)
    return () => unsubscribe(listener)
  }

  worker.addEventListener('message', e => {
    listeners.forEach(listener => listener(e.data))
  })

  const dispatch = (actionName, ...args) => {
    worker.postMessage({actionName, args})
  }

  return {
    dispatch,
    subscribe,
  }
}
