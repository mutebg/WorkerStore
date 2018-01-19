let state
const PUT = 'PUT'

function isGenerator(obj) {
  return typeof obj.next === 'function' && typeof obj.throw === 'function'
}

function setState(newState, overwrite = false) {
  return (state = overwrite
    ? newState
    : Object.assign(Object.assign({}, newState), update))
}

export function put(newState) {
  return {[PUT]: newState}
}

function postState(s) {
  self.postMessage(s)
}

function coroutine(generator) {
  const handle = result => {
    if (result.value && result.value[PUT]) {
      postState(setState(result.value[PUT]))
    }

    if (result.done) return Promise.resolve(result.value)
    return Promise.resolve(result.value).then(res => {
      return handle(generator.next(res))
    })
  }
  return handle(generator.next())
}

export function runStore(publicActions) {
  const privateActions = {
    '@init': (currentState, payload) => payload,
  }
  const actions = Object.assign(privateActions, publicActions)

  function sendNextState({actionName, args}) {
    let nextStateResult = actions[actionName](state, ...args)
    if (typeof nextStateResult === 'function') {
      nextStateResult = nextStateResult()
    }

    // handle promises
    if (nextStateResult.then) {
      nextStateResult.then(s => {
        postState(setState(s))
      })

      // handle generators
    } else if (isGenerator(nextStateResult)) {
      coroutine(nextStateResult)

      // handle all other type
    } else if (nextStateResult) {
      postState(setState(nextStateResult))
    }
  }

  self.onmessage = ({data}) => sendNextState(data)
}

export default null
