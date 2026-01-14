import { describe, it, expect, afterAll } from 'vitest';

import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

const testCases = [
  { n: 0, expected: 0 },
  { n: 1, expected: 1 },
  { n: 2, expected: 3 },
  { n: 5, expected: 15 },
  { n: 10, expected: 55 },
  { n: 100, expected: 5050 },
];

let allSucceeded = true;

describe('Problem 1', () => {
  describe('sum_to_n_a (math formula)', () => {
    it('should compute the sum 1..n correctly', () => {
      testCases.forEach(({ n, expected }) => {
        expect(sum_to_n_a(n)).toBe(expected);
      });
    });
  });

  describe('sum_to_n_b (for loop)', () => {
    it('should compute the sum 1..n correctly', () => {
      testCases.forEach(({ n, expected }) => {
        expect(sum_to_n_b(n)).toBe(expected);
      });
    });
  });

  describe('sum_to_n_c (recursion)', () => {
    it('should compute the sum 1..n correctly', () => {
      testCases.forEach(({ n, expected }) => {
        expect(sum_to_n_c(n)).toBe(expected);
      });
    });
  });
});

afterAll(() => {
  if (allSucceeded) {
    // eslint-disable-next-line no-console
    console.log('success');
  }
});