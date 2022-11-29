function sum(a, b) {
  return a + b;
}

test('adds 1 and 2 to euqal 3', () => {
  expect(sum(1, 2)).toBe(3);
})