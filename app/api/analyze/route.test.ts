import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { getAIContentSuggestions } from '@/lib/openai-service';

// Mock the dependencies
vi.mock('@/lib/seo-analyzer', () => ({
  analyzeSEO: vi.fn(),
}));

vi.mock('@/lib/openai-service', () => ({
  getAIContentSuggestions: vi.fn(),
}));

describe('POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('should return 400 if content is missing', async () => {
    const request = createMockRequest({ targetKeyword: 'test' });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Content is required and must be a string' });
  });

  it('should return 400 if content is not a string', async () => {
    const request = createMockRequest({ content: 123, targetKeyword: 'test' });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Content is required and must be a string' });
  });

  it('should handle successful analysis with AI suggestions', async () => {
    const mockSeoAnalysis = { score: 85, issues: [] };
    const mockAiSuggestions = ['Suggestion 1', 'Suggestion 2'];

    vi.mocked(analyzeSEO).mockReturnValue(mockSeoAnalysis);
    vi.mocked(getAIContentSuggestions).mockResolvedValue(mockAiSuggestions);

    const request = createMockRequest({ content: 'Test content', targetKeyword: 'test' });
    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(analyzeSEO).toHaveBeenCalledWith('Test content', 'test');
    expect(getAIContentSuggestions).toHaveBeenCalledWith('Test content', 'test');

    expect(data).toEqual({
      success: true,
      analysis: {
        ...mockSeoAnalysis,
        aiSuggestions: mockAiSuggestions,
      }
    });
  });

  it('should handle AI suggestion failure gracefully', async () => {
    const mockSeoAnalysis = { score: 85, issues: [] };

    vi.mocked(analyzeSEO).mockReturnValue(mockSeoAnalysis);
    vi.mocked(getAIContentSuggestions).mockRejectedValue(new Error('AI API failed'));

    // Suppress console.error for this test to keep output clean
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const request = createMockRequest({ content: 'Test content', targetKeyword: 'test' });
    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toEqual({
      success: true,
      analysis: {
        ...mockSeoAnalysis,
        aiSuggestions: null,
      }
    });

    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON body', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: 'invalid json',
    });

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to analyze content' });

    consoleSpy.mockRestore();
  });
});
