const sum = require('./sum');

// Basic addition test
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// Test with zero
test('adds 0 + 5 to equal 5', () => {
  expect(sum(0, 5)).toBe(5);
});

test('adds 5 + 0 to equal 5', () => {
  expect(sum(5, 0)).toBe(5);
});

// Test with negative numbers
test('adds -1 + 5 to equal 4', () => {
  expect(sum(-1, 5)).toBe(4);
});

test('adds 1 + -5 to equal -4', () => {
  expect(sum(1, -5)).toBe(-4);
});

test('adds -1 + -5 to equal -6', () => {
  expect(sum(-1, -5)).toBe(-6);
});

// Test with decimal numbers
test('adds 1.5 + 2.5 to equal 4', () => {
  expect(sum(1.5, 2.5)).toBe(4);
});

test('adds 2.2 + 2.8 to equal 5', () => {
  expect(sum(2.2, 2.8)).toBeCloseTo(5);
});

// Test with large numbers
test('adds 100000 + 100000 to equal 200000', () => {
  expect(sum(100000, 100000)).toBe(200000);
});

// Test with small numbers
test('adds 0.1 + 0.2 to equal 0.3', () => {
  expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
});
