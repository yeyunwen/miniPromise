const isPromise = (obj) => {
  return !!(obj && typeof obj === "object" && typeof obj.then === "function");
};

export default isPromise;
