Jest Testing Example

#npm install --save-dev jest

#A simple function to add two numbers - 'sum.js'


#Test cases for the sum function:  'sum.test.js' 

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 0 + 0 to equal 0', () => {
  expect(sum(0, 0)).toBe(0);
});

test('adds -1 + 1 to equal 0', () => {
  expect(sum(-1, 1)).toBe(0);
});

test('adds 100 + 200 to equal 300', () => {
  expect(sum(100, 200)).toBe(300);
});

test('adds -100 + -200 to equal -300', () => {
  expect(sum(-100, -200)).toBe(-300);
});

#Running Tests
npm test

#Expected Output

PASS  ./sum.test.js
-adds 1 + 2 to equal 3
- adds 0 + 0 to equal 0
- adds -1 + 1 to equal 0
- adds 100 + 200 to equal 300
  -adds -100 + -200 to equal -300
