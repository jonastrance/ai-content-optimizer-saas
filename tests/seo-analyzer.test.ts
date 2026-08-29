import { describe, it, expect } from 'vitest';
import { analyzeSEO } from '../lib/seo-analyzer';

describe('analyzeSEO - Heading analysis', () => {
  it('should add an issue when there are no headings', () => {
    const result = analyzeSEO('This is some content without any headings.');
    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
    expect(result.strengths).not.toContain('Content uses headings for better structure.');
  });

  it('should add a strength when there are HTML headings', () => {
    const result = analyzeSEO('<h1>Title</h1><p>Some content</p>');
    expect(result.strengths).toContain('Content uses headings for better structure.');
    expect(result.issues).not.toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });

  it('should add a strength when there are Markdown headings', () => {
    const result = analyzeSEO('# Title\n\nSome content');
    expect(result.strengths).toContain('Content uses headings for better structure.');
    expect(result.issues).not.toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });

  it('should detect h6 HTML tags', () => {
    const result = analyzeSEO('<h6>Subtitle</h6><p>Some content</p>');
    expect(result.strengths).toContain('Content uses headings for better structure.');
  });

  it('should detect h6 Markdown tags', () => {
    const result = analyzeSEO('###### Subtitle\n\nSome content');
    expect(result.strengths).toContain('Content uses headings for better structure.');
  });
});
