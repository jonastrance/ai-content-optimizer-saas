import { NextRequest } from 'next/server';
import { POST } from './route';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { getAIContentSuggestions } from '@/lib/openai-service';

// Mock the dependencies
jest.mock('@/lib/seo-analyzer', () => ({
  analyzeSEO: jest.fn(),
}));

jest.mock('@/lib/openai-service', () => ({
  getAIContentSuggestions: jest.fn(),
}));

describe('POST /api/analyze', () => {
  const mockAnalyzeSEO = analyzeSEO as jest.MockedFunction<typeof analyzeSEO>;
  const mockGetAIContentSuggestions = getAIContentSuggestions as jest.MockedFunction<typeof getAIContentSuggestions>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const createMockRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('should return 400 if content is missing', async () => {
    const request = createMockRequest({});
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Content is required and must be a string' });
    expect(mockAnalyzeSEO).not.toHaveBeenCalled();
    expect(mockGetAIContentSuggestions).not.toHaveBeenCalled();
  });

  it('should return 400 if content is not a string', async () => {
    const request = createMockRequest({ content: 123 });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Content is required and must be a string' });
    expect(mockAnalyzeSEO).not.toHaveBeenCalled();
    expect(mockGetAIContentSuggestions).not.toHaveBeenCalled();
  });

  it('should return analysis with AI suggestions successfully', async () => {
    const mockSeoResult = {
      seoScore: 85,
      readabilityScore: 70,
      keywordDensity: 1.5,
      wordCount: 500,
      suggestions: ['Add more keywords'],
      issues: [],
      strengths: ['Good length'],
    };
    const mockAiResult = {
      improvements: ['Improve sentence structure'],
      keywordSuggestions: ['seo', 'optimization'],
      structureRecommendations: ['Use H2 tags'],
      competitorInsights: ['Competitors have longer content'],
    };

    mockAnalyzeSEO.mockReturnValue(mockSeoResult);
    mockGetAIContentSuggestions.mockResolvedValue(mockAiResult);

    const request = createMockRequest({ content: 'Test content here.', targetKeyword: 'test' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      analysis: {
        ...mockSeoResult,
        aiSuggestions: mockAiResult,
      },
    });
    expect(mockAnalyzeSEO).toHaveBeenCalledWith('Test content here.', 'test');
    expect(mockGetAIContentSuggestions).toHaveBeenCalledWith('Test content here.', 'test');
  });

  it('should return analysis successfully when no target keyword is provided', async () => {
    const mockSeoResult = {
      seoScore: 80,
      readabilityScore: 75,
      keywordDensity: 0,
      wordCount: 400,
      suggestions: [],
      issues: [],
      strengths: [],
    };
    const mockAiResult = {
      improvements: [],
      keywordSuggestions: [],
      structureRecommendations: [],
      competitorInsights: [],
    };

    mockAnalyzeSEO.mockReturnValue(mockSeoResult);
    mockGetAIContentSuggestions.mockResolvedValue(mockAiResult);

    const request = createMockRequest({ content: 'Content without keyword.' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      analysis: {
        ...mockSeoResult,
        aiSuggestions: mockAiResult,
      },
    });
    expect(mockAnalyzeSEO).toHaveBeenCalledWith('Content without keyword.', undefined);
    expect(mockGetAIContentSuggestions).toHaveBeenCalledWith('Content without keyword.', undefined);
  });

  it('should return analysis with aiSuggestions as null if AI service fails', async () => {
    const mockSeoResult = {
      seoScore: 80,
      readabilityScore: 75,
      keywordDensity: 1,
      wordCount: 400,
      suggestions: [],
      issues: [],
      strengths: [],
    };

    mockAnalyzeSEO.mockReturnValue(mockSeoResult);
    mockGetAIContentSuggestions.mockRejectedValue(new Error('AI API Error'));

    const request = createMockRequest({ content: 'Test content', targetKeyword: 'test' });

    // Suppress console.error for this specific test to avoid messy test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      analysis: {
        ...mockSeoResult,
        aiSuggestions: null,
      },
    });
  });

  it('should return 500 if an unexpected error occurs during request processing', async () => {
    // Force request.json() to throw an error
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: 'invalid json{',
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to analyze content' });
  });
});
