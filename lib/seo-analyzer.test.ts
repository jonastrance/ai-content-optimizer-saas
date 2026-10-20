import { describe, it, expect } from 'vitest';
import { analyzeSEO } from './seo-analyzer';

describe('analyzeSEO', () => {
  it('should detect short content and suggest more words', () => {
    const content = Array(100).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(100);
    expect(result.issues).toContain('Content is too short. Aim for at least 300 words for better SEO.');
    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });

  it('should suggest expanding content if word count is between 300 and 599', () => {
    const content = Array(400).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(400);
    expect(result.suggestions).toContain('Consider expanding content to 600+ words for better rankings.');
  });

  it('should mark good content length for 600 to 1499 words', () => {
    const content = Array(1000).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(1000);
    expect(result.strengths).toContain('Good content length.');
  });

  it('should mark excellent content length for 1500+ words', () => {
    const content = Array(1600).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.wordCount).toBe(1600);
    expect(result.strengths).toContain('Excellent content length for comprehensive coverage.');
  });

  it('should detect low readability score', () => {
    const content = Array(50).fill('hippopotamus incomprehensibility juxtaposition').join(' ');
    const result = analyzeSEO(content);

    expect(result.issues).toContain('Content readability is difficult. Simplify sentences and use shorter words.');
  });

  it('should detect good readability score', () => {
    // Generate text with some multisyllabic words and longer sentences to hit 60-80 range
    const content = Array(30).fill('Programming can be fun. Logic is good for developers.').join(' ');
    const result = analyzeSEO(content);

    expect(result.strengths).toContain('Good readability score. Content is easy to understand.');
  });

  it('should report missing target keyword', () => {
    const content = Array(300).fill('word').join(' ');
    const result = analyzeSEO(content, 'keyword');

    expect(result.issues).toContain('Target keyword "keyword" not found in content.');
  });

  it('should suggest increasing target keyword usage when density is low', () => {
    const content = 'keyword ' + Array(399).fill('word').join(' ');
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(0.25);
    expect(result.suggestions.some(s => s.includes('Increase usage of target keyword "keyword"'))).toBe(true);
  });

  it('should report keyword stuffing when density is too high', () => {
    const content = Array(20).fill('keyword').join(' ') + ' ' + Array(80).fill('word').join(' ');
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(20);
    expect(result.issues.some(s => s.includes('Keyword density too high'))).toBe(true);
  });

  it('should report good keyword density', () => {
    const content = Array(2).fill('keyword').join(' ') + ' ' + Array(98).fill('word').join(' ');
    const result = analyzeSEO(content, 'keyword');

    expect(result.keywordDensity).toBe(2);
    expect(result.strengths).toContain('Good keyword density for "keyword": 2.00%');
  });

  it('should detect missing headings', () => {
    const content = Array(100).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });

  it('should detect HTML headings', () => {
    const content = '<h2>Heading</h2> ' + Array(100).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.strengths).toContain('Content uses headings for better structure.');
  });

  it('should detect Markdown headings', () => {
    const content = '# Heading\n' + Array(100).fill('word').join(' ');
    const result = analyzeSEO(content);

    expect(result.strengths).toContain('Content uses headings for better structure.');
  });
});
