export const random_int = (start: number, end: number): number =>
  Math.floor(Math.random() * (end - start + 1)) + start;
