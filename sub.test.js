const sub = require('./sub');

// Basic subtraction test
test('subtracts 5 - 2 to equal 3', () => {
  expect(sub(5, 2)).toBe(3);
});

// Test with zero
test('subtracts 5 - 0 to equal 5', () => {
  expect(sub(5, 0)).toBe(5);
});

test('subtracts 0 - 5 to equal -5', () => {
  expect(sub(0, 5)).toBe(-5);
});

// Test with negative numbers
test('subtracts -1 - 5 to equal -6', () => {
  expect(sub(-1, 5)).toBe(-6);
});

test('subtracts 1 - -5 to equal 6', () => {
  expect(sub(1, -5)).toBe(6);
});

test('subtracts -1 - -5 to equal 4', () => {
  expect(sub(-1, -5)).toBe(4);
});

// Test with decimal numbers
test('subtracts 2.5 - 1.5 to equal 1', () => {
  expect(sub(2.5, 1.5)).toBe(1);
});

test('subtracts 5.5 - 2.2 to equal 3.3', () => {
  expect(sub(5.5, 2.2)).toBeCloseTo(3.3);
});

// Test with large numbers
test('subtracts 100000 - 50000 to equal 50000', () => {
  expect(sub(100000, 50000)).toBe(50000);
});
