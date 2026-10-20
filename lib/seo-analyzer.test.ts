import { describe, it, expect } from 'vitest';
import { analyzeSEO } from './seo-analyzer';

describe('analyzeSEO', () => {
  it('should flag short content', () => {
    const content = 'This is a short text.';
    const result = analyzeSEO(content);
    expect(result.wordCount).toBe(5);
    expect(result.issues).toContain('Content is too short. Aim for at least 300 words for better SEO.');
  });

  it('should suggest expanding adequate content', () => {
    const content = Array(350).fill('word').join(' ');
    const result = analyzeSEO(content);
    expect(result.wordCount).toBe(350);
    expect(result.suggestions).toContain('Consider expanding content to 600+ words for better rankings.');
  });

  it('should praise excellent content length', () => {
    const content = Array(1600).fill('word').join(' ');
    const result = analyzeSEO(content);
    expect(result.wordCount).toBe(1600);
    expect(result.strengths).toContain('Excellent content length for comprehensive coverage.');
  });

  it('should praise good content length', () => {
    const content = Array(800).fill('word').join(' ');
    const result = analyzeSEO(content);
    expect(result.wordCount).toBe(800);
    expect(result.strengths).toContain('Good content length.');
  });

  it('should flag complex readability', () => {
    const content = 'The multifaceted manifestation of this paradigm exemplifies an extraordinarily obfuscated conceptualization. Such circuitous circumlocutions unequivocally necessitate simplification.';
    const result = analyzeSEO(content);
    expect(result.issues).toContain('Content readability is difficult. Simplify sentences and use shorter words.');
  });

  it('should praise good readability', () => {
    // Generate content that scores between 60 and 80 on Flesch reading ease
    const content = 'This sentence is an example of average reading difficulty. It should score somewhere in the middle range.';
    const result = analyzeSEO(content);
    expect(result.strengths).toContain('Good readability score. Content is easy to understand.');
  });

  it('should flag target keyword not found', () => {
    const content = 'This is some content without the keyword.';
    const result = analyzeSEO(content, 'missing');
    expect(result.keywordDensity).toBe(0);
    expect(result.issues).toContain('Target keyword "missing" not found in content.');
  });

  it('should suggest increasing target keyword usage if density is low', () => {
    const content = Array(300).fill('word').join(' ') + ' missing';
    const result = analyzeSEO(content, 'missing');
    expect(result.keywordDensity).toBeLessThan(0.5);
    expect(result.suggestions).toContain(`Increase usage of target keyword "missing". Current density: ${result.keywordDensity.toFixed(2)}%`);
  });

  it('should flag target keyword density too high', () => {
    const content = Array(10).fill('keyword').join(' ') + ' word';
    const result = analyzeSEO(content, 'keyword');
    expect(result.keywordDensity).toBeGreaterThan(3);
    expect(result.issues).toContain(`Keyword density too high (${result.keywordDensity.toFixed(2)}%). Risk of keyword stuffing.`);
  });

  it('should praise good target keyword density', () => {
    const content = Array(98).fill('word').join(' ') + ' keyword keyword';
    const result = analyzeSEO(content, 'keyword');
    expect(result.keywordDensity).toBeGreaterThanOrEqual(0.5);
    expect(result.keywordDensity).toBeLessThanOrEqual(3);
    expect(result.strengths).toContain(`Good keyword density for "keyword": ${result.keywordDensity.toFixed(2)}%`);
  });

  it('should flag missing headings', () => {
    const content = 'Just a normal paragraph without any headings.';
    const result = analyzeSEO(content);
    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });

  it('should praise headings when present (markdown)', () => {
    const content = '# Heading 1\n\nSome text under heading.';
    const result = analyzeSEO(content);
    expect(result.strengths).toContain('Content uses headings for better structure.');
  });

  it('should praise headings when present (html)', () => {
    const content = '<h2>Heading 2</h2><p>Some text under heading.</p>';
    const result = analyzeSEO(content);
    expect(result.strengths).toContain('Content uses headings for better structure.');
  });

  it('should compute valid SEO score for poor content', () => {
    const content = 'Short text.';
    const result = analyzeSEO(content, 'missing');
    expect(result.seoScore).toBeGreaterThanOrEqual(0);
    expect(result.seoScore).toBeLessThan(50);
  });

  it('should compute valid SEO score for great content', () => {
    const content = '# Excellent Content\n\n' + Array(1500).fill('word').join(' ') + ' keyword '.repeat(20) + 'Simple sentences are great. They make it easy to read.';
    const result = analyzeSEO(content, 'keyword');
    expect(result.seoScore).toBeGreaterThanOrEqual(50);
    expect(result.seoScore).toBeLessThanOrEqual(100);
  });
});
