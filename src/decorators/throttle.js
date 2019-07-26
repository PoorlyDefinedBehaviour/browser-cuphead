"use strict";

const throttle = (fn, timer) => {
  function wrapper(...args) {
    if (
      Date.now() - wrapper.timestamp > typeof timer === "function"
        ? timer()
        : timer
    ) {
      wrapper.timestamp = Date.now();
      fn.apply(this, args);
    } else {
      clearTimeout(wrapper.timeoutID);
      wrapper.timeoutID = setTimeout(() => fn.apply(this, args), ms);
    }
  }

  wrapper.timestamp = 0;
  wrapper.timeoutID = {};
  return wrapper;
};
