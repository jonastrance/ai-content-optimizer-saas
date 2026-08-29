import { analyzeSEO } from './seo-analyzer';

describe('SEO Analyzer', () => {
  // Helper to generate text with specific characteristics
  function generateText(wordCount: number, wordsPerSentence = 15, wordPattern = ['word']): string {
    let text = '';
    for (let i = 0; i < wordCount; i++) {
      text += wordPattern[i % wordPattern.length] + ' ';
      if ((i + 1) % wordsPerSentence === 0) {
        text = text.trim() + '. ';
      }
    }
    return text.trim();
  }

  it('should analyze short content and report issues', () => {
    // 100 words, < 300 words
    const content = generateText(100);
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(100);
    expect(result.issues).toContain('Content is too short. Aim for at least 300 words for better SEO.');
    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });

  it('should analyze medium content and report suggestions', () => {
    // 400 words, between 300 and 600
    const content = '<h1>Title</h1>\n' + generateText(400);
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(401);
    expect(result.suggestions).toContain('Consider expanding content to 600+ words for better rankings.');
    expect(result.strengths).toContain('Content uses headings for better structure.');
  });

  it('should analyze excellent content length', () => {
    // 1600 words, >= 1500
    const content = '<h1>Title</h1>\n' + generateText(1600);
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(1601);
    expect(result.strengths).toContain('Excellent content length for comprehensive coverage.');
  });

  it('should identify difficult readability', () => {
    // Difficult readability: long sentences, many syllables
    const content = generateText(400, 40, ['internationalization']);
    const result = analyzeSEO(content);

    expect(result.issues).toContain('Content readability is difficult. Simplify sentences and use shorter words.');
  });

  it('should identify good readability', () => {
    // Good readability: 15 words/sentence, alternating 1 and 2 syllables (e.g. 'word', 'testing') -> ~65 score
    const content = generateText(400, 15, ['word', 'testing']);
    const result = analyzeSEO(content);

    expect(result.strengths).toContain('Good readability score. Content is easy to understand.');
  });

  it('should handle missing target keyword', () => {
    const content = generateText(400);
    const result = analyzeSEO(content, 'missingkeyword');

    expect(result.issues).toContain('Target keyword "missingkeyword" not found in content.');
  });

  it('should report when keyword density is too low (< 0.5%)', () => {
    // 400 words, 1 keyword = 0.25%
    const content = 'keyword ' + generateText(399);
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(0.25);
    expect(result.suggestions.some(s => s.includes('Increase usage of target keyword "keyword"'))).toBe(true);
  });

  it('should report optimal keyword density (0.5% - 3%)', () => {
    // 400 words, 4 keywords = 1%
    const content = 'keyword keyword keyword keyword ' + generateText(396);
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(1);
    expect(result.strengths.some(s => s.includes('Good keyword density for "keyword"'))).toBe(true);
  });

  it('should report when keyword density is too high (> 3%)', () => {
    // 100 words, 5 keywords = 5%
    const content = 'keyword keyword keyword keyword keyword ' + generateText(95);
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(5);
    expect(result.issues.some(s => s.includes('Keyword density too high'))).toBe(true);
  });

  it('should recognize markdown headings', () => {
    const content = '### Subtitle\n' + generateText(100);
    const result = analyzeSEO(content);

    expect(result.strengths).toContain('Content uses headings for better structure.');
  });

  it('should return a valid SEO score structure', () => {
    const content = '<h1>Title</h1>\n' + generateText(400);
    const result = analyzeSEO(content, 'word');

    expect(result).toHaveProperty('seoScore');
    expect(result).toHaveProperty('readabilityScore');
    expect(result).toHaveProperty('keywordDensity');
    expect(result).toHaveProperty('wordCount');
    expect(result).toHaveProperty('suggestions');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('strengths');
    expect(typeof result.seoScore).toBe('number');
    expect(result.seoScore).toBeGreaterThanOrEqual(0);
    expect(result.seoScore).toBeLessThanOrEqual(100);
  });
});
