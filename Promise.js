import getMicroTask from "./getMicroTask.js";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const runMicroTask = getMicroTask();

class MyPromise {
  #state = PENDING;
  #result = undefined;
  constructor(executor) {
    try {
      executor(this.#_resolve, this.#_reject);
    } catch (error) {
      this.#_reject(error);
    }
  }

  #_resolve = (data) => {
    this.#changeState(FULFILLED, data);
  };

  #_reject = (reason) => {
    this.#changeState(REJECTED, reason);
  };

  #changeState = (state, value) => {
    console.log(state, value);
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = value;
  };
}

const p1 = new MyPromise((resolve, reject) => {
  throw new Error("error");
});
