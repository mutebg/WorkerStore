const worker = new Worker("worker.js", {type:'module'});

const dispatch = (actionName, ...args) => {
  worker.postMessage({actionName, args});
}

const createStore = (worker) => {

}

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

onClick('#inc', () => dispatch('inc'));
onClick('#dec', () => dispatch('dec'));
onClick('#fetch', () => dispatch('fetch', 2));
onClick('#calc-in-main', () => { console.log( fibonacci(40) ) });
onClick('#calc-in-worker', () => dispatch('fib'));
onClick('#json-in-main', () => {
  fetch('/MOCK_DATA.json').then( res => res.json() ).then( json => console.log(json) )
});
onClick('#json-in-worker', () => dispatch('fetch_json'));

const count = document.querySelector('#count');


worker.addEventListener('message', (e) => {
  console.timeEnd();
  count.innerHTML = JSON.stringify( e.data );

}, false);

console.time();
setTimeout( () => console.timeEnd(), 1000 * 1);
