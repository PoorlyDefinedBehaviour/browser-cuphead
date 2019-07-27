"use strict";

const debounce = (fn, ms) => {
  function wrapper(...args) {
    if (Date.now() - wrapper.timestamp > ms) {
      fn.apply(this, args);
      wrapper.timestamp = Date.now();
    }
  }

  wrapper.timestamp = 0;
  return wrapper;
};
