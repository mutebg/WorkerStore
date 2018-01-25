export const createStore = (initState, worker) => {
  let listeners = []
  let lastMessage = {
    state: initState,
    action: null,
  }

  const unsubscribe = listener => {
    const out = []
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
    if (lastMessage) {
      listener(lastMessage)
    }
    return () => unsubscribe(listener)
  }

  worker.addEventListener('message', e => {
    lastMessage = e.data
    listeners.forEach(listener => listener(e.data))
  })

  const dispatch = (actionName, ...args) => {
    worker.postMessage({actionName, args})
  }

  // dispatch initial state
  dispatch('@init', initState)

  const getState = () => lastMessage.state

  return {
    getState,
    dispatch,
    subscribe,
  }
}

export default {
  createStore,
}
