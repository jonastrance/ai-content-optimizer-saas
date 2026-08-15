import { getAIContentSuggestions } from './openai-service';
import OpenAI from 'openai';

jest.mock('openai', () => {
  const mCreate = jest.fn();
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mCreate,
      },
    },
  }));
});

describe('getAIContentSuggestions', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockCreate = new OpenAI().chat.completions.create as jest.Mock;
  });

  it('should return parsed suggestions on a successful API response', async () => {
    const mockContent = 'This is the mock content to analyze.';
    const mockSuggestions = {
      improvements: ['Improvement 1', 'Improvement 2'],
      keywordSuggestions: ['Keyword 1', 'Keyword 2'],
      structureRecommendations: ['Structure 1', 'Structure 2'],
      competitorInsights: ['Insight 1', 'Insight 2'],
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockSuggestions),
          },
        },
      ],
    });

    const result = await getAIContentSuggestions(mockContent);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
        messages: expect.any(Array),
        response_format: { type: 'json_object' },
      })
    );
    expect(result).toEqual(mockSuggestions);
  });

  it('should include targetKeyword in the prompt when provided', async () => {
    const mockContent = 'This is the mock content to analyze.';
    const mockTargetKeyword = 'SEO Optimization';
    const mockSuggestions = {
      improvements: ['Improvement 1'],
      keywordSuggestions: ['SEO Optimization', 'Keyword 2'],
      structureRecommendations: ['Structure 1'],
      competitorInsights: ['Insight 1'],
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockSuggestions),
          },
        },
      ],
    });

    const result = await getAIContentSuggestions(mockContent, mockTargetKeyword);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const mockCallArg = mockCreate.mock.calls[0][0];
    const userMessage = mockCallArg.messages.find((m: any) => m.role === 'user');

    expect(userMessage.content).toContain(`Target Keyword: ${mockTargetKeyword}`);
    expect(result).toEqual(mockSuggestions);
  });

  it('should fall back to default suggestions when the API throws an error', async () => {
    // Spy on console.error to suppress the error message in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockCreate.mockRejectedValueOnce(new Error('API Error'));

    const result = await getAIContentSuggestions('Content without target keyword');

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

    consoleSpy.mockRestore();
  });

  it('should fall back to default suggestions when the API returns an empty result', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: null,
          },
        },
      ],
    });

    const result = await getAIContentSuggestions('Content to trigger empty result');

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

    expect(consoleSpy).toHaveBeenCalledWith('Error getting AI suggestions:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
