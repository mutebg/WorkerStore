const createStore = (worker) => {
  let listeners = [];

  const unsubscribe = (listener) => {
    let out = [];
		for (let i=0; i<listeners.length; i++) {
			if (listeners[i]===listener) {
				listener = null;
			}
			else {
				out.push(listeners[i]);
			}
		}
		listeners = out;
  }

  const subscribe = ( listener ) => {
    listeners.push(listener);
    return () => unsubscribe(listener);
  }

  worker.addEventListener('message', e => {
    listeners.forEach( listener => listener(e.data) );
  });

  const dispatch = (actionName, ...args) => {
    worker.postMessage({actionName, args});
  }

  return {
    dispatch,
    subscribe,
  }
}

const store = createStore( new Worker("worker.js", {type:'module'}) )

const { dispatch, subscribe } = store;


function fibonacci(num) {
  if (num <= 1) return 1;

  return fibonacci(num - 1) + fibonacci(num - 2);
}
function onClick(btnId, callback) {
  document.querySelector(btnId).addEventListener('click', () => {
    console.time();
    callback();
  });
}

const sub = subscribe( data => {
  count.innerHTML = JSON.stringify( data );
  console.timeEnd()
})

onClick('#inc', () => dispatch('inc'));
onClick('#dec', () => dispatch('dec'));
onClick('#fetch', () => dispatch('fetch', 2));
onClick('#calc-in-main', () => { console.log( fibonacci(40) ) });
onClick('#calc-in-worker', () => dispatch('fib'));
onClick('#json-in-main', () => {
  sub();
});

const count = document.querySelector('#count');




console.time();
setTimeout( () => console.timeEnd(), 1000 * 1);
