import { describe, it, expect } from 'vitest';
import { analyzeSEO } from './seo-analyzer';

describe('SEO Analyzer', () => {
  describe('calculateReadabilityScore', () => {
    it('returns readability score of 0 for empty strings', () => {
      const result = analyzeSEO('');
      expect(result.readabilityScore).toBe(0);
    });

    it('returns readability score of 0 for strings with no sentences but some words', () => {
      const result = analyzeSEO('...');
      expect(result.readabilityScore).toBe(0);
    });

    it('returns a positive readability score for a normal sentence', () => {
      const result = analyzeSEO('This is a normal sentence. It has punctuation and words.');
      expect(result.readabilityScore).toBeGreaterThan(0);
    });
  });
});
