import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as openaiService from './openai-service';

vi.mock('openai', () => {
  const mockCreate = vi.fn();
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
    mockCreate,
  };
});

import { mockCreate } from 'openai';

describe('openai-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return fallback suggestions when OpenAI throws an error', async () => {
    mockCreate.mockRejectedValue(new Error('OpenAI Error'));

    const content = 'Test content';
    const targetKeyword = 'SEO';

    const result = await openaiService.getAIContentSuggestions(content, targetKeyword);

    expect(result).toEqual({
      improvements: [
        'Expand content with more detailed explanations',
        'Add relevant examples and case studies',
        'Include data and statistics to support claims',
      ],
      keywordSuggestions: [targetKeyword],
      structureRecommendations: [
        'Use clear headings (H1, H2, H3) to organize content',
        'Break long paragraphs into shorter, scannable sections',
        'Add bullet points for better readability',
      ],
      competitorInsights: [
        'Top-ranking content typically exceeds 1,500 words',
        'Use multimedia elements like images and videos',
        'Focus on answering user questions comprehensively',
      ],
    });
  });

  it('should return fallback suggestions when OpenAI throws an error without targetKeyword', async () => {
    mockCreate.mockRejectedValue(new Error('OpenAI Error'));

    const content = 'Test content';

    const result = await openaiService.getAIContentSuggestions(content);

    expect(result).toEqual({
      improvements: [
        'Expand content with more detailed explanations',
        'Add relevant examples and case studies',
        'Include data and statistics to support claims',
      ],
      keywordSuggestions: ['Focus on your target keywords'],
      structureRecommendations: [
        'Use clear headings (H1, H2, H3) to organize content',
        'Break long paragraphs into shorter, scannable sections',
        'Add bullet points for better readability',
      ],
      competitorInsights: [
        'Top-ranking content typically exceeds 1,500 words',
        'Use multimedia elements like images and videos',
        'Focus on answering user questions comprehensively',
      ],
    });
  });
});
