import { describe, it, expect, vi, beforeEach } from 'vitest';
import OpenAI from 'openai';
import { getAIContentSuggestions, generateContentImprovement } from './openai-service';

vi.mock('openai', () => {
  const mOpenAI = {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  };
  return {
    default: vi.fn(() => mOpenAI),
  };
});

describe('openai-service', () => {
  let openaiInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    openaiInstance = new OpenAI();
  });

  describe('getAIContentSuggestions', () => {
    it('should return parsed JSON suggestions on success', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                improvements: ['Improvement 1'],
                keywordSuggestions: ['Keyword 1'],
                structureRecommendations: ['Structure 1'],
                competitorInsights: ['Insight 1'],
              }),
            },
          },
        ],
      };

      openaiInstance.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await getAIContentSuggestions('Test content');

      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: expect.any(Array),
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      expect(result).toEqual({
        improvements: ['Improvement 1'],
        keywordSuggestions: ['Keyword 1'],
        structureRecommendations: ['Structure 1'],
        competitorInsights: ['Insight 1'],
      });
    });

    it('should include target keyword in the prompt if provided', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                improvements: [],
                keywordSuggestions: [],
                structureRecommendations: [],
                competitorInsights: [],
              }),
            },
          },
        ],
      };

      openaiInstance.chat.completions.create.mockResolvedValue(mockResponse);

      await getAIContentSuggestions('Test content', 'test-keyword');

      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('Target Keyword: test-keyword'),
            }),
          ]),
        })
      );
    });

    it('should return fallback suggestions if OpenAI throws an error', async () => {
      openaiInstance.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await getAIContentSuggestions('Test content');

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

    it('should return fallback suggestions with target keyword if OpenAI throws an error and target keyword is provided', async () => {
      openaiInstance.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await getAIContentSuggestions('Test content', 'my-keyword');

      expect(result.keywordSuggestions).toEqual(['my-keyword']);
    });

    it('should throw and return fallback if no content in response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };
      openaiInstance.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await getAIContentSuggestions('Test content');
      expect(result.improvements.length).toBeGreaterThan(0); // Assuming fallback has improvements
    });
  });

  describe('generateContentImprovement', () => {
    it('should return improved content on success', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Improved text content',
            },
          },
        ],
      };

      openaiInstance.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await generateContentImprovement('Original text', 'Make it better');

      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining('Make it better'),
          })
        ]),
        temperature: 0.7,
        max_tokens: 500,
      });

      expect(result).toBe('Improved text content');
    });

    it('should return error message if OpenAI throws an error', async () => {
      openaiInstance.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await generateContentImprovement('Original text', 'Make it better');

      expect(result).toBe('Unable to generate improvement at this time');
    });

    it('should return fallback message if no content in response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };

      openaiInstance.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await generateContentImprovement('Original text', 'Make it better');

      expect(result).toBe('Unable to generate improvement');
    });
  });
});
