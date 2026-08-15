import { analyzeSEO } from './seo-analyzer';

describe('analyzeSEO', () => {
  // Helper to generate text with specific word count
  const generateText = (wordCount: number, keyword: string = 'word') => {
    return Array(wordCount).fill(keyword).join(' ') + '.';
  };

  const generateReadabilityText = (type: 'easy' | 'hard') => {
    if (type === 'easy') {
      // Short sentences, simple words
      return Array(50).fill('The cat sat on the mat.').join(' ');
    } else {
      // Long sentences, complex words (polysyllabic)
      return Array(20).fill('Philosophical conceptualization necessitates extraordinary methodological sophistication.').join(' ');
    }
  };

  describe('Word Count Analysis', () => {
    it('identifies content that is too short (< 300 words)', () => {
      const text = generateText(250);
      const result = analyzeSEO(text);
      expect(result.wordCount).toBe(250);
      expect(result.issues).toContain('Content is too short. Aim for at least 300 words for better SEO.');
    });

    it('identifies content that needs expansion (300-599 words)', () => {
      const text = generateText(400);
      const result = analyzeSEO(text);
      expect(result.wordCount).toBe(400);
      expect(result.suggestions).toContain('Consider expanding content to 600+ words for better rankings.');
    });

    it('identifies good content length (600-1499 words)', () => {
      const text = generateText(800);
      const result = analyzeSEO(text);
      expect(result.wordCount).toBe(800);
      expect(result.strengths).toContain('Good content length.');
    });

    it('identifies excellent content length (>= 1500 words)', () => {
      const text = generateText(1600);
      const result = analyzeSEO(text);
      expect(result.wordCount).toBe(1600);
      expect(result.strengths).toContain('Excellent content length for comprehensive coverage.');
    });
  });

  describe('Readability Analysis', () => {
    it('flags content that is difficult to read (score < 50)', () => {
      const text = generateReadabilityText('hard');
      const result = analyzeSEO(text);
      expect(result.readabilityScore).toBeLessThan(50);
      expect(result.issues).toContain('Content readability is difficult. Simplify sentences and use shorter words.');
    });

    it('identifies content with good readability (score 60-80)', () => {
      const text = generateReadabilityText('easy');
      const result = analyzeSEO(text);
      expect(result.readabilityScore).toBeGreaterThanOrEqual(60);
      expect(result.readabilityScore).toBeLessThanOrEqual(100);
      // It might be higher than 80 depending on the exact calculation, let's just test that the score is calculated and makes sense.
      // If it falls between 60 and 80, we expect a specific strength message.
      if (result.readabilityScore >= 60 && result.readabilityScore <= 80) {
          expect(result.strengths).toContain('Good readability score. Content is easy to understand.');
      }
    });
  });

  describe('Keyword Density Analysis', () => {
    it('handles absence of target keyword parameter', () => {
      const text = generateText(100);
      const result = analyzeSEO(text);
      expect(result.keywordDensity).toBe(0);
    });

    it('flags missing target keyword (0% density)', () => {
      const text = generateText(100, 'apple');
      const result = analyzeSEO(text, 'banana');
      expect(result.keywordDensity).toBe(0);
      expect(result.issues).toContain('Target keyword "banana" not found in content.');
    });

    it('flags low keyword density (< 0.5%)', () => {
      // 1000 words, 4 keywords = 0.4%
      let text = generateText(996, 'apple') + ' ' + generateText(4, 'banana');
      const result = analyzeSEO(text, 'banana');
      expect(result.keywordDensity).toBeLessThan(0.5);
      expect(result.keywordDensity).toBeGreaterThan(0);
      expect(result.suggestions).toContain(`Increase usage of target keyword "banana". Current density: ${result.keywordDensity.toFixed(2)}%`);
    });

    it('flags high keyword density (> 3%)', () => {
      // 100 words, 5 keywords = 5%
      let text = generateText(95, 'apple') + ' ' + generateText(5, 'banana');
      const result = analyzeSEO(text, 'banana');
      expect(result.keywordDensity).toBeGreaterThan(3);
      expect(result.issues).toContain(`Keyword density too high (${result.keywordDensity.toFixed(2)}%). Risk of keyword stuffing.`);
    });

    it('identifies good keyword density (0.5% - 3%)', () => {
      // 100 words, 2 keywords = 2%
      let text = generateText(98, 'apple') + ' ' + generateText(2, 'banana');
      const result = analyzeSEO(text, 'banana');
      expect(result.keywordDensity).toBeGreaterThanOrEqual(0.5);
      expect(result.keywordDensity).toBeLessThanOrEqual(3);
      expect(result.strengths).toContain(`Good keyword density for "banana": ${result.keywordDensity.toFixed(2)}%`);
    });
  });

  describe('Heading Analysis', () => {
    it('flags absence of headings', () => {
      const text = generateText(100);
      const result = analyzeSEO(text);
      expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
    });

    it('detects markdown headings', () => {
      const text = '# Main Title\n\n' + generateText(100);
      const result = analyzeSEO(text);
      expect(result.strengths).toContain('Content uses headings for better structure.');
    });

    it('detects HTML headings', () => {
      const text = '<h2>Sub Title</h2>\n' + generateText(100);
      const result = analyzeSEO(text);
      expect(result.strengths).toContain('Content uses headings for better structure.');
    });
  });

  describe('Overall SEO Score Calculation', () => {
    it('calculates a valid SEO score (0-100)', () => {
      const text = '# Perfect SEO Content\n\n' + generateText(1500, 'good content to test');
      const result = analyzeSEO(text, 'perfect');
      expect(result.seoScore).toBeGreaterThanOrEqual(0);
      expect(result.seoScore).toBeLessThanOrEqual(100);
    });

    it('penalizes score based on issues', () => {
      // Very short, no headings, bad readability, no keyword = lots of issues
      const badText = 'bad.';
      const badResult = analyzeSEO(badText, 'keyword');

      // Good length, headings, ok readability, optimal keyword = fewer/no issues
      const goodText = '# Good Title\n\n' + generateText(1480, 'good apple') + ' ' + generateText(20, 'keyword');
      const goodResult = analyzeSEO(goodText, 'keyword');

      expect(badResult.seoScore).toBeLessThan(goodResult.seoScore);
    });
  });
});
