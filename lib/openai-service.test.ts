import { getAIContentSuggestions } from './openai-service';

// Mock OpenAI
jest.mock('openai', () => {
  const mOpenAI = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };
  return jest.fn(() => mOpenAI);
});

import OpenAI from 'openai';

describe('getAIContentSuggestions error path', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return fallback suggestions if OpenAI API throws an error with targetKeyword', async () => {
    // Setup the mock to throw an error
    const openai = new OpenAI();
    (openai.chat.completions.create as jest.Mock).mockRejectedValue(new Error('OpenAI API Error'));

    const content = "Test content";
    const targetKeyword = "test keyword";

    const result = await getAIContentSuggestions(content, targetKeyword);

    // Check error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting AI suggestions:', expect.any(Error));

    // Check fallback returned
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

  it('should return fallback suggestions if OpenAI API throws an error without targetKeyword', async () => {
    // Setup the mock to throw an error
    const openai = new OpenAI();
    (openai.chat.completions.create as jest.Mock).mockRejectedValue(new Error('OpenAI API Error'));

    const content = "Test content";

    const result = await getAIContentSuggestions(content);

    // Check error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting AI suggestions:', expect.any(Error));

    // Check fallback returned
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

  it('should return fallback suggestions if OpenAI API returns empty result', async () => {
    // Setup the mock to return empty choice
    const openai = new OpenAI();
    (openai.chat.completions.create as jest.Mock).mockResolvedValue({
      choices: [{ message: { content: null } }]
    });

    const content = "Test content";

    const result = await getAIContentSuggestions(content);

    // Check error was logged ("No response from OpenAI")
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting AI suggestions:', expect.any(Error));
    expect(consoleErrorSpy.mock.calls[0][1].message).toBe('No response from OpenAI');

    // Check fallback returned
    expect(result).toBeDefined();
    expect(result.improvements).toBeDefined();
  });
});
