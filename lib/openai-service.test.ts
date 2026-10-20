import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAIContentSuggestions, generateContentImprovement } from './openai-service';
import OpenAI from 'openai';

// Mock the OpenAI module
vi.mock('openai', () => {
  const mockCreate = vi.fn();
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

describe('openai-service', () => {
  let mockCreate: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get the mocked constructor
    const MockedOpenAI = vi.mocked(OpenAI);
    // Instantiate it to get the instance we'll use
    const openaiInstance = new MockedOpenAI();
    mockCreate = openaiInstance.chat.completions.create;
  });

  describe('getAIContentSuggestions', () => {
    it('should return valid suggestions when OpenAI API succeeds', async () => {
      const mockResponseData = {
        improvements: ['Improvement 1'],
        keywordSuggestions: ['Keyword 1'],
        structureRecommendations: ['Structure 1'],
        competitorInsights: ['Insight 1'],
      };

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponseData),
            },
          },
        ],
      });

      const result = await getAIContentSuggestions('Sample content', 'target keyword');

      expect(result).toEqual(mockResponseData);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
        })
      );
    });

    it('should return fallback suggestions if OpenAI API throws an error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      const result = await getAIContentSuggestions('Sample content', 'target keyword');

      expect(result).toEqual({
        improvements: [
          'Expand content with more detailed explanations',
          'Add relevant examples and case studies',
          'Include data and statistics to support claims',
        ],
        keywordSuggestions: ['target keyword'],
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

    it('should return fallback suggestions if OpenAI returns empty content', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: '',
            },
          },
        ],
      });

      const result = await getAIContentSuggestions('Sample content');

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

  describe('generateContentImprovement', () => {
    it('should return improved content when OpenAI API succeeds', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Improved text snippet',
            },
          },
        ],
      });

      const result = await generateContentImprovement('Original content', 'Suggestion');

      expect(result).toBe('Improved text snippet');
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('should return default error message if OpenAI API throws an error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      const result = await generateContentImprovement('Original content', 'Suggestion');

      expect(result).toBe('Unable to generate improvement at this time');
    });

    it('should return default fallback message if OpenAI returns empty content', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: '',
            },
          },
        ],
      });

      const result = await generateContentImprovement('Original content', 'Suggestion');

      expect(result).toBe('Unable to generate improvement');
    });
  });
});
