export const random_float = (start: number, end: number): number =>
  Math.random() * (end - start + 1) + start;
