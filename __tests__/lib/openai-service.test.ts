import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAIContentSuggestions, generateContentImprovement } from '../../lib/openai-service';
import OpenAI from 'openai';

// Mock the openai module
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

describe('OpenAI Service', () => {
  let mockCreate: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get a reference to the mocked method
    mockCreate = new OpenAI({ apiKey: 'test' }).chat.completions.create;
  });

  describe('getAIContentSuggestions', () => {
    const mockContent = 'This is a sample content for SEO optimization.';

    it('should return parsed suggestions on successful API call with target keyword', async () => {
      const mockResponse = {
        improvements: ['Improvement 1'],
        keywordSuggestions: ['Keyword 1'],
        structureRecommendations: ['Structure 1'],
        competitorInsights: ['Insight 1'],
      };

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponse),
            },
          },
        ],
      });

      const result = await getAIContentSuggestions(mockContent, 'SEO optimization');

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.model).toBe('gpt-4o-mini');
      expect(callArgs.messages[1].content).toContain(mockContent);
      expect(callArgs.messages[1].content).toContain('Target Keyword: SEO optimization');

      expect(result).toEqual(mockResponse);
    });

    it('should handle API call without target keyword', async () => {
      const mockResponse = {
        improvements: ['Improvement 1'],
        keywordSuggestions: ['Keyword 1'],
        structureRecommendations: ['Structure 1'],
        competitorInsights: ['Insight 1'],
      };

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponse),
            },
          },
        ],
      });

      const result = await getAIContentSuggestions(mockContent);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[1].content).not.toContain('Target Keyword:');

      expect(result).toEqual(mockResponse);
    });

    it('should return fallback suggestions if API call fails', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      const result = await getAIContentSuggestions(mockContent, 'target');

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        improvements: [
          'Expand content with more detailed explanations',
          'Add relevant examples and case studies',
          'Include data and statistics to support claims',
        ],
        keywordSuggestions: ['target'],
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

    it('should return fallback suggestions without target keyword if API call fails', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      const result = await getAIContentSuggestions(mockContent);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(result.keywordSuggestions).toEqual(['Focus on your target keywords']);
    });

    it('should handle empty or null content from OpenAI gracefully', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      });

      const result = await getAIContentSuggestions(mockContent);

      // Should fall back since 'No response from OpenAI' error is thrown internally
      expect(result.improvements.length).toBeGreaterThan(0);
    });
  });

  describe('generateContentImprovement', () => {
    const mockOriginalContent = 'Original text';
    const mockSuggestion = 'Make it better';

    it('should return generated improvement on success', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Improved text',
            },
          },
        ],
      });

      const result = await generateContentImprovement(mockOriginalContent, mockSuggestion);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[1].content).toContain(mockOriginalContent);
      expect(callArgs.messages[1].content).toContain(mockSuggestion);
      expect(result).toBe('Improved text');
    });

    it('should return fallback string on API failure', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      const result = await generateContentImprovement(mockOriginalContent, mockSuggestion);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(result).toBe('Unable to generate improvement at this time');
    });

    it('should return fallback string when OpenAI returns empty content', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: '',
            },
          },
        ],
      });

      const result = await generateContentImprovement(mockOriginalContent, mockSuggestion);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(result).toBe('Unable to generate improvement');
    });
  });
});
