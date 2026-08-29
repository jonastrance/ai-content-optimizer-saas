import { describe, it, expect } from 'vitest';
import { analyzeSEO } from './seo-analyzer';

describe('analyzeSEO', () => {
  it('should analyze content perfectly (happy path)', () => {
    // A decently long text with good readability, headings, and keyword density.
    const content = `
      # The Ultimate Guide to SEO

      SEO is very important. To succeed, you need good SEO practices.
      This is a simple sentence. We can write more sentences to increase word count.
      ` + 'This is a simple sentence. We need more words. '.repeat(50) + `
      In conclusion, SEO is crucial.
    `;
    const result = analyzeSEO(content, 'SEO');

    expect(result.wordCount).toBeGreaterThan(300);
    expect(result.readabilityScore).toBeGreaterThan(60);
    expect(result.keywordDensity).toBeGreaterThan(0);
    expect(result.seoScore).toBeGreaterThan(50);
  });

  it('should detect when content is too short', () => {
    const content = 'This is too short.';
    const result = analyzeSEO(content);

    expect(result.wordCount).toBeLessThan(300);
    expect(result.issues).toContain('Content is too short. Aim for at least 300 words for better SEO.');
  });

  it('should detect when readability is too complex', () => {
    const content = 'The ubiquitous manifestation of sesquipedalian nomenclature inadvertently obfuscates the fundamental paradigm of epistemological inquiry, rendering comprehensible elucidation virtually unattainable for the uninitiated demographic.';
    const result = analyzeSEO(content);

    expect(result.readabilityScore).toBeLessThan(50);
    expect(result.issues).toContain('Content readability is difficult. Simplify sentences and use shorter words.');
  });

  it('should detect missing target keyword', () => {
    const content = 'This text has a decent length, but misses the mark completely.';
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(0);
    expect(result.issues).toContain('Target keyword "keyword" not found in content.');
  });

  it('should detect missing headings', () => {
    const content = 'Just some plain text without any structure or headings whatsoever.';
    const result = analyzeSEO(content);

    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });
});
