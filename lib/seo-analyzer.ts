// SEO Scoring utilities

export interface SEOAnalysis {
  seoScore: number;
  readabilityScore: number;
  keywordDensity: number;
  wordCount: number;
  suggestions: string[];
  issues: string[];
  strengths: string[];
}

export function analyzeSEO(content: string, targetKeyword?: string): SEOAnalysis {
  const wordCount = countWords(content);
  const readabilityScore = calculateReadabilityScore(content, wordCount);
  const keywordDensity = targetKeyword ? calculateKeywordDensity(content, targetKeyword) : 0;
  
  const suggestions: string[] = [];
  const issues: string[] = [];
  const strengths: string[] = [];

  // Word count analysis
  if (wordCount < 300) {
    issues.push('Content is too short. Aim for at least 300 words for better SEO.');
  } else if (wordCount >= 300 && wordCount < 600) {
    suggestions.push('Consider expanding content to 600+ words for better rankings.');
  } else if (wordCount >= 1500) {
    strengths.push('Excellent content length for comprehensive coverage.');
  } else {
    strengths.push('Good content length.');
  }

  // Readability analysis
  if (readabilityScore < 50) {
    issues.push('Content readability is difficult. Simplify sentences and use shorter words.');
  } else if (readabilityScore >= 60 && readabilityScore <= 80) {
    strengths.push('Good readability score. Content is easy to understand.');
  }

  // Keyword density analysis
  if (targetKeyword) {
    if (keywordDensity === 0) {
      issues.push(`Target keyword "${targetKeyword}" not found in content.`);
    } else if (keywordDensity < 0.5) {
      suggestions.push(`Increase usage of target keyword "${targetKeyword}". Current density: ${keywordDensity.toFixed(2)}%`);
    } else if (keywordDensity > 3) {
      issues.push(`Keyword density too high (${keywordDensity.toFixed(2)}%). Risk of keyword stuffing.`);
    } else {
      strengths.push(`Good keyword density for "${targetKeyword}": ${keywordDensity.toFixed(2)}%`);
    }
  }

  // Heading analysis
  const hasHeadings = /<h[1-6]>/i.test(content) || /^#{1,6}\s/m.test(content);
  if (!hasHeadings) {
    issues.push('No headings found. Use H1, H2, H3 tags to structure content.');
  } else {
    strengths.push('Content uses headings for better structure.');
  }

  // Calculate overall SEO score
  const seoScore = calculateSEOScore({
    wordCount,
    readabilityScore,
    keywordDensity,
    hasHeadings,
    issuesCount: issues.length,
  });

  return {
    seoScore,
    readabilityScore,
    keywordDensity,
    wordCount,
    suggestions,
    issues,
    strengths,
  };
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function calculateReadabilityScore(text: string, wordCount: number): number {
  // Simplified Flesch Reading Ease score
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = wordCount;
  const syllables = estimateSyllables(text);

  if (sentences === 0 || words === 0) return 0;

  const avgSentenceLength = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  const score = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  
  return Math.max(0, Math.min(100, score));
}

function estimateSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;

  for (const word of words) {
    syllableCount += countSyllablesInWord(word);
  }

  return syllableCount;
}

function countSyllablesInWord(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  const vowels = word.match(/[aeiouy]+/g);
  if (!vowels) return 1;

  let count = vowels.length;
  
  // Subtract silent e
  if (word.endsWith('e')) count--;
  
  return Math.max(1, count);
}

function calculateKeywordDensity(content: string, keyword: string): number {
  const words = countWords(content);
  if (words === 0) return 0;

  const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = content.match(keywordRegex);
  const keywordCount = matches ? matches.length : 0;

  return (keywordCount / words) * 100;
}

function calculateSEOScore(params: {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: number;
  hasHeadings: boolean;
  issuesCount: number;
}): number {
  let score = 0;

  // Word count contribution (0-25 points)
  if (params.wordCount >= 1500) score += 25;
  else if (params.wordCount >= 1000) score += 20;
  else if (params.wordCount >= 600) score += 15;
  else if (params.wordCount >= 300) score += 10;

  // Readability contribution (0-25 points)
  if (params.readabilityScore >= 60 && params.readabilityScore <= 80) score += 25;
  else if (params.readabilityScore >= 50 && params.readabilityScore <= 90) score += 20;
  else if (params.readabilityScore >= 40) score += 15;

  // Keyword density contribution (0-20 points)
  if (params.keywordDensity >= 0.5 && params.keywordDensity <= 3) score += 20;
  else if (params.keywordDensity > 0 && params.keywordDensity < 0.5) score += 10;

  // Headings contribution (0-15 points)
  if (params.hasHeadings) score += 15;

  // Deduct for issues (0-15 points)
  const issuesPenalty = Math.min(15, params.issuesCount * 5);
  score += Math.max(0, 15 - issuesPenalty);

  return Math.round(Math.max(0, Math.min(100, score)));
}
