import { getMicroTask, isPromise } from "./utils/index.js";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const runMicroTask = getMicroTask();

export default class MyPromise {
  #state = PENDING;
  #result = undefined;
  #handlers = [];
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

  /**
   * 改变Promise状态
   * @param {FULFILLED | REJECTED} state
   * @param {*} value
   * @returns void
   */
  #changeState = (state, value) => {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = value;
    this.#runHandlers();
  };

  #runHandlers = () => {
    console.log(`运行${this.#handlers.length}个回调`);
    for (const handler of this.#handlers) {
      this.#runOneHandler(handler);
    }
    this.#handlers = [];
  };

  #runOneHandler = ({ executor, state, resolve, reject }) => {
    runMicroTask(() => {
      if (this.#state !== state) return;
      if (typeof executor !== "function") {
        this.#state === FULFILLED
          ? resolve(this.#result)
          : reject(this.#result);
        return;
      }
      try {
        const result = executor(this.#result);
        if (isPromise(result)) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 添加回调函数
   * @param {Function} executor 成功或失败的回调
   * @param {FULFILLED | REJECTED} state 状态，用于记录该回调应该在什么状态执行
   * @param {Function} resolve
   * @param {Function} reject
   * @returns void
   * @description 一个Promise实例可以有多个then方法
   * 可以通过多次调用**该实例**then方法添加回调，
   * 在该实例状态改变后，会依次执行所有添加的回调
   */
  #pushHandlers = (executor, state, resolve, reject) => {
    this.#handlers.push({
      executor,
      state,
      resolve,
      reject,
    });
  };

  /**
   * 符合PromiseA+规范的then方法
   * @param {Function} onFulfilled 成功回调
   * @param {Function} onRejected 失败回调
   * @returns {MyPromise}
   */
  then = (onFulfilled, onRejected) => {
    return new MyPromise((resolve, reject) => {
      this.#pushHandlers(onFulfilled, FULFILLED, resolve, reject);
      this.#pushHandlers(onRejected, REJECTED, resolve, reject);
      if (this.#state === PENDING) return;
      this.#runHandlers();
    });
  };
}
