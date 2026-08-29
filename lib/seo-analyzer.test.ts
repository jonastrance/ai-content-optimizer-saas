import { describe, it, expect } from 'vitest';
import { analyzeSEO } from './seo-analyzer';

describe('seo-analyzer', () => {
  describe('analyzeSEO', () => {
    it('should handle an empty string gracefully', () => {
      const result = analyzeSEO('');

      expect(result.wordCount).toBe(0);
      expect(result.readabilityScore).toBe(0);
      expect(result.keywordDensity).toBe(0);

      expect(result.issues).toContain('Content is too short. Aim for at least 300 words for better SEO.');
      expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');

      // Ensure the overall score is correctly calculated and valid
      expect(typeof result.seoScore).toBe('number');
      expect(result.seoScore).toBeGreaterThanOrEqual(0);
      expect(result.seoScore).toBeLessThanOrEqual(100);
    });

    it('should handle an empty string with target keyword gracefully', () => {
      const result = analyzeSEO('', 'test');

      expect(result.wordCount).toBe(0);
      expect(result.keywordDensity).toBe(0);
      expect(result.issues).toContain('Target keyword "test" not found in content.');
    });
  });
});
