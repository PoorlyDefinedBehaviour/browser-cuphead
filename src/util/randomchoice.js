function random_choice(a, b) {
  if (Array.isArray(a)) {
    return a[Math.floor(Math.random() * a.length) - 1];
  }

  return random_int(0, 1) ? a : b;
}
