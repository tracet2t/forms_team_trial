const div = require('./div');

// Basic division test
test('divides 6 / 2 to equal 3', () => {
  expect(div(6, 2)).toBe(3);
});

// Test with one
test('divides 5 / 1 to equal 5', () => {
  expect(div(5, 1)).toBe(5);
});

test('divides 1 / 5 to equal 0.2', () => {
  expect(div(1, 5)).toBe(0.2);
});

// Test with negative numbers
test('divides -10 / 2 to equal -5', () => {
  expect(div(-10, 2)).toBe(-5);
});

test('divides 10 / -2 to equal -5', () => {
  expect(div(10, -2)).toBe(-5);
});

test('divides -10 / -2 to equal 5', () => {
  expect(div(-10, -2)).toBe(5);
});

// Test with decimal numbers
test('divides 5.5 / 2 to equal 2.75', () => {
  expect(div(5.5, 2)).toBeCloseTo(2.75);
});

test('divides 2.2 / 2 to equal 1.1', () => {
  expect(div(2.2, 2)).toBeCloseTo(1.1);
});

// Test with large numbers
test('divides 1000000 / 1000 to equal 1000', () => {
  expect(div(1000000, 1000)).toBe(1000);
});

// Test division by zero
test('throws error when dividing by zero', () => {
  expect(() => {
    div(1, 0);
  }).toThrow('Cannot divide by zero');
});
