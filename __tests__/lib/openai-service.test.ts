import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAIContentSuggestions } from '../../lib/openai-service';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
  const OpenAI = vi.fn();
  OpenAI.prototype.chat = {
    completions: {
      create: vi.fn(),
    },
  };
  return { default: OpenAI };
});

describe('getAIContentSuggestions fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns fallback suggestions when OpenAI API fails', async () => {
    // Suppress console.error during the test to avoid polluting output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Get the mock instance
    const openaiMock = new OpenAI();

    // Setup the mock to throw an error
    (openaiMock.chat.completions.create as any).mockRejectedValueOnce(
      new Error('OpenAI API Error')
    );

    const result = await getAIContentSuggestions('Sample content', 'seo');

    // Assert that the fallback object is returned
    expect(result).toEqual({
      improvements: [
        'Expand content with more detailed explanations',
        'Add relevant examples and case studies',
        'Include data and statistics to support claims',
      ],
      keywordSuggestions: ['seo'],
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

    // Assert that console.error was called
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error getting AI suggestions:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('returns fallback suggestions without target keyword', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const openaiMock = new OpenAI();
    (openaiMock.chat.completions.create as any).mockRejectedValueOnce(
      new Error('OpenAI API Error')
    );

    const result = await getAIContentSuggestions('Sample content');

    expect(result.keywordSuggestions).toEqual(['Focus on your target keywords']);

    consoleSpy.mockRestore();
  });
});
