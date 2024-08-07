const { add, subtract, mul, dev } = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('subtracts 5 - 2 to equal 3', () => {
  expect(subtract(5, 2)).toBe(3);
});

test('adds -1 + -1 to equal -2', () => {
  expect(add(-1, -1)).toBe(-2);
});

test('subtracts 0 - 0 to equal 0', () => {
  expect(subtract(0, 0)).toBe(0);
});

test('mul 2 * 6 to equal 12', () => {
  expect(mul(2, 6)).toBe(12);
});

test('dev 4 / -2 to equal -2', () => {
  expect(dev(4, -2)).toBe(-2);
});