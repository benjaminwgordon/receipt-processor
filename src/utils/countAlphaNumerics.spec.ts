import { countAlphaNumerics } from './countAlphaNumerics';

test('should valid count alphanumeric characters', () => {
  expect(countAlphaNumerics('abcd1234')).toBe(8);
});

test('should ignore non-alpha characters', () => {
  expect(countAlphaNumerics('%abcd1234%')).toBe(8);
});

test('should return 0 for empty strings', () => {
  expect(countAlphaNumerics('')).toBe(0);
});
