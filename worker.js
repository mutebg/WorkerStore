importScripts('./worker-import.js');


function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

const initState = {
  count: 0,
  news: null
}

workerImport( initState, {
  inc: (state) => ({count: state.count + 1}),
  dec: (state) => ({count: state.count - 1}),
  fetch: (state, payload) => fetch('https://jsonplaceholder.typicode.com/posts/' + payload)
      .then( res => res.json())
      .then( json => ({news: json}))
})
