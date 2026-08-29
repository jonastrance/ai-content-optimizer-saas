import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/analyze/route';
import * as openaiService from '@/lib/openai-service';
import * as seoAnalyzer from '@/lib/seo-analyzer';

// Mock the dependencies
vi.mock('@/lib/openai-service', () => ({
  getAIContentSuggestions: vi.fn(),
}));

vi.mock('@/lib/seo-analyzer', () => ({
  analyzeSEO: vi.fn(),
}));

describe('POST /api/analyze', () => {
  const mockSEOAnalysis = {
    score: 80,
    keywordDensity: 2.5,
    issues: [],
  };

  const mockAISuggestions = {
    title: 'Suggested Title',
    content: 'Suggested content improvements',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(seoAnalyzer.analyzeSEO).mockReturnValue(mockSEOAnalysis as any);
  });

  it('should return 400 if content is missing', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ targetKeyword: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Content is required and must be a string');
  });

  it('should return 200 with analysis and AI suggestions on success', async () => {
    const content = 'Test content';
    const targetKeyword = 'test';
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content, targetKeyword }),
    });

    vi.mocked(openaiService.getAIContentSuggestions).mockResolvedValueOnce(
      mockAISuggestions as any
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis).toEqual({
      ...mockSEOAnalysis,
      aiSuggestions: mockAISuggestions,
    });

    expect(seoAnalyzer.analyzeSEO).toHaveBeenCalledWith(content, targetKeyword);
    expect(openaiService.getAIContentSuggestions).toHaveBeenCalledWith(content, targetKeyword);
  });

  it('should return 200 and set aiSuggestions to null if getAIContentSuggestions throws an error', async () => {
    const content = 'Test content';
    const targetKeyword = 'test';
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content, targetKeyword }),
    });

    // Mock getAIContentSuggestions to throw an error
    const errorMessage = 'AI Service Unavailable';
    vi.mocked(openaiService.getAIContentSuggestions).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Suppress console.error for this test as we expect an error to be logged
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis.aiSuggestions).toBeNull();

    // Verify that the analysis part is still present
    expect(data.analysis.score).toBe(mockSEOAnalysis.score);

    expect(consoleSpy).toHaveBeenCalledWith('AI suggestions failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
