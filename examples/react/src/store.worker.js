import {runStore, put} from 'worker-store/worker'

function fibonacci(num) {
  if (num <= 1) return 1
  return fibonacci(num - 1) + fibonacci(num - 2)
}

runStore({
  inc: state => ({count: state.count + 1}),
  dec: state => ({count: state.count - 1}),

  // calc fibonacci in a webworker so main thread stays free
  fib: (state, number) => ({count: fibonacci(number)}),

  // using promises
  delay: state =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve({count: state.count + 1}), 2000)
    }),

  //using async/await
  fetchNews: async (state, {id}) => {
    let res = await fetch('https://jsonplaceholder.typicode.com/posts/' + id)
    return {news: await res.json()}
  },

  asyncGen: function*(state) {
    try {
      yield put({status: 'loading'})
      const responses = yield fetch(
        'https://jsonplaceholder.typicode.com/posts/1',
      )
      const news = yield responses.json()
      yield put({news: news})
      yield put({status: 'done'})
    } catch (err) {
      return {status: 'loaded', error: true}
    }
  },
})
