
function workerImport(initState, actions) {

  let state = initState;

  function setState(update, overwrite = false) {
  	return state = overwrite ? update : assign(assign({}, state), update);
  }

  function assign(obj, props) {
  	for (let i in props) obj[i] = props[i];
  	return obj;
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
