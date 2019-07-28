
export const debounce = (fn: any, ms: number): any => {
  function wrapper(this: any, ...args: any): any {
    if (Date.now() - wrapper.timestamp > ms) {
      fn.apply(this, args);
      wrapper.timestamp = Date.now();
    }
  }

  wrapper.timestamp = 0;
  return wrapper;
};
