import { createStore } from "../";
import { runStore } from "../worker";

const mockWorkerInstance = {
  postMessage: () => jest.fn(),
  addEventListener: () => jest.fn()
};

const store = createStore({ count: 1 }, mockWorkerInstance);

test("createStore exists", () => {
  expect(createStore).toBeDefined();
});

test("Initial state", () => {
  const { getState } = store;
  expect(getState()).toEqual({ count: 1 });
});

test("Dispatch sends data to worker", () => {
  const spy = jest.spyOn(mockWorkerInstance, "postMessage");
  const { dispatch } = store;
  dispatch("add", "payload");
  expect(spy).toHaveBeenCalled();
  expect(mockWorkerInstance.postMessage.mock.calls[0][0]).toEqual({
    actionName: "add",
    args: ["payload"]
  });
});

test("Subscribe receive current store state on subscribe", () => {
  const { subscribe } = store;
  subscribe(data => {
    expect(data).toEqual({ count: 1 });
  });
});

////
// TEST WORKER

const self = {
  postMessage: () => jest.fn()
};

runStore({
  inc: ({ count }) => ({ count: count + 1 }),
  dec: ({ count }) => ({ count: count - 1 })
});

test("TODO: Worker", () => {
  expect(1).toBe(1);
});
