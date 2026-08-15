import { calculateReadabilityScore } from './seo-analyzer';

describe('calculateReadabilityScore', () => {
  it('should return 0 for empty string', () => {
    expect(calculateReadabilityScore('')).toBe(0);
  });

  it('should return 0 for text with no valid sentences', () => {
    expect(calculateReadabilityScore('     ')).toBe(0);
    expect(calculateReadabilityScore('!?.')).toBe(0);
  });

  it('should calculate score for simple text', () => {
    // "The cat sat on the mat." (6 words, 1 sentence, 6 syllables)
    // Avg sentence length: 6, Avg syllables: 1
    // Score: 206.835 - (1.015 * 6) - (84.6 * 1) = 206.835 - 6.09 - 84.6 = 116.145 (capped at 100)
    expect(calculateReadabilityScore('The cat sat on the mat.')).toBe(100);
  });

  it('should calculate score for medium complexity text', () => {
    // Just verifying it computes a number between 0 and 100 correctly and less than 100
    const text = 'This is a slightly more complex sentence that might result in a lower score.';
    const score = calculateReadabilityScore(text);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('should clamp extremely complex text to 0', () => {
    // Very complex words, many syllables per word
    const text = 'The juxtaposition of epistemological paradigms fundamentally obfuscates the underlying ontological realities.';
    const score = calculateReadabilityScore(text);
    expect(score).toBe(0);
  });
});
