export function runWorker(publicActions) {
  let state;

  const privateActions = {
    '@init': (state, payload) => payload
  }
  const actions = Object.assign( privateActions, publicActions );


  function setState(update, overwrite = false) {
  	return state = overwrite ? update : Object.assign( Object.assign({}, state), update);
  }

  function sendNextState({actionName, args}) {
    let nextStateResult = actions[actionName](state, ...args);
    if ( typeof nextStateResult == 'function' ) {
      nextStateResult = nextStateResult();
    }

    if (nextStateResult.then) {
      nextStateResult.then( s => {
        self.postMessage( setState(s) );
      })
    } else {
      self.postMessage( setState(nextStateResult) );
    }
  }

  self.addEventListener('message', (e) => {
    sendNextState(e.data);
  }, false);
}
