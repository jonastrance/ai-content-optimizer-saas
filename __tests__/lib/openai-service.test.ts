import { getAIContentSuggestions, generateContentImprovement } from '../../lib/openai-service';
import OpenAI from 'openai';

const mockCreate = jest.fn();

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: (...args: any[]) => mockCreate(...args),
      },
    },
  }));
});

describe('openai-service', () => {
  beforeEach(() => {
    mockCreate.mockClear();
  });

  describe('getAIContentSuggestions', () => {
    it('should return parsed suggestions on successful API call', async () => {
      const mockResult = {
        improvements: ['Test improvement 1'],
        keywordSuggestions: ['Test keyword 1'],
        structureRecommendations: ['Test structure 1'],
        competitorInsights: ['Test insight 1'],
      };

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResult),
            },
          },
        ],
      });

      const result = await getAIContentSuggestions('Test content', 'test keyword');

      expect(result).toEqual(mockResult);
      expect(mockCreate).toHaveBeenCalled();
    });

    it('should return fallback suggestions on API error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      // Suppress console.error in this test to keep output clean
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getAIContentSuggestions('Test content', 'target-kw');

      expect(result).toEqual({
        improvements: [
          'Expand content with more detailed explanations',
          'Add relevant examples and case studies',
          'Include data and statistics to support claims',
        ],
        keywordSuggestions: ['target-kw'],
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
      expect(mockCreate).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('generateContentImprovement', () => {
    it('should return generated improvement on success', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Improved content snippet',
            },
          },
        ],
      });

      const result = await generateContentImprovement('Original', 'Suggestion');
      expect(result).toBe('Improved content snippet');
    });

    it('should return fallback message on API error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await generateContentImprovement('Original', 'Suggestion');
      expect(result).toBe('Unable to generate improvement at this time');

      consoleSpy.mockRestore();
    });
  });
});
