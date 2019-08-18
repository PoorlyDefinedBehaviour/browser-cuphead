import { random_int } from "./RandomInt";

export const random_choice = (a: any, b: any): any => {
  if (Array.isArray(a)) {
    return a[Math.floor(Math.random() * a.length) - 1];
  }

  return random_int(0, 1) ? a : b;
};
