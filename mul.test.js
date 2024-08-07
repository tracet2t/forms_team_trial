const mul = require('./mul');

// Basic multiplication test
test('multiplies 1 * 2 to equal 2', () => {
  expect(mul(1, 2)).toBe(2);
});

// Test with zero
test('multiplies 0 * 5 to equal 0', () => {
  expect(mul(0, 5)).toBe(0);
});

// Test with negative numbers
test('multiplies -1 * 5 to equal -5', () => {
  expect(mul(-1, 5)).toBe(-5);
});

test('multiplies 1 * -5 to equal -5', () => {
  expect(mul(1, -5)).toBe(-5);
});

test('multiplies -1 * -5 to equal 5', () => {
  expect(mul(-1, -5)).toBe(5);
});

// Test with decimal numbers
test('multiplies 1.5 * 2 to equal 3', () => {
  expect(mul(1.5, 2)).toBe(3);
});

test('multiplies 2 * 2.5 to equal 5', () => {
  expect(mul(2, 2.5)).toBe(5);
});

// Test with large numbers
test('multiplies 100000 * 100000 to equal 10000000000', () => {
  expect(mul(100000, 100000)).toBe(10000000000);
});

// Test with small numbers
test('multiplies 0.1 * 0.2 to equal 0.02', () => {
  expect(mul(0.1, 0.2)).toBeCloseTo(0.02);
});
