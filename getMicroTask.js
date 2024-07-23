const geMickroTask = () => {
  if (process && process.nextTick) {
    return (callback) => {
      process.nextTick(callback);
    };
  } else if (MutationObserver) {
    return (callback) => {
      const observer = new MutationObserver(callback);
      const textNode = document.createTextNode(0);
      observer.observe(textNode, { characterData: true });
      textNode.data = 1;
    };
  } else if (queueMicrotask) {
    return (callback) => {
      queueMicrotask(callback);
    };
  } else {
    return (callback) => {
      setTimeout(callback, 0);
    };
  }
};

export default geMickroTask;
