import { NextRequest } from 'next/server';
import { POST } from '../app/api/analyze/route';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { getAIContentSuggestions } from '@/lib/openai-service';

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

  it('should return 400 if content is missing', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Content is required and must be a string');
  });

  it('should return 400 if content is not a string', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content: 123 }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Content is required and must be a string');
  });

  it('should return 500 if request body is empty (invalid JSON)', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: '',
    });
    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to analyze content');
  });

  it('should return 200 with analysis and AI suggestions on success', async () => {
    const mockSeoAnalysis = {
      seoScore: 80,
      readabilityScore: 70,
      keywordDensity: 1.5,
      wordCount: 500,
      suggestions: ['sug1'],
      issues: ['issue1'],
      strengths: ['strength1']
    };
    const mockAiSuggestions = ['ai1', 'ai2'];

    (analyzeSEO as any).mockReturnValue(mockSeoAnalysis);
    (getAIContentSuggestions as any).mockResolvedValue(mockAiSuggestions);

    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content: 'Valid test content', targetKeyword: 'test' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.analysis.seoScore).toBe(mockSeoAnalysis.seoScore);
    expect(data.analysis.aiSuggestions).toEqual(mockAiSuggestions);

    expect(analyzeSEO).toHaveBeenCalledWith('Valid test content', 'test');
    expect(getAIContentSuggestions).toHaveBeenCalledWith('Valid test content', 'test');
  });

  it('should handle AI suggestion failure gracefully', async () => {
    const mockSeoAnalysis = {
      seoScore: 80,
      readabilityScore: 70,
      keywordDensity: 1.5,
      wordCount: 500,
      suggestions: ['sug1'],
      issues: ['issue1'],
      strengths: ['strength1']
    };

    (analyzeSEO as any).mockReturnValue(mockSeoAnalysis);
    (getAIContentSuggestions as any).mockRejectedValue(new Error('AI failed'));

    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content: 'Valid test content', targetKeyword: 'test' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.analysis.seoScore).toBe(mockSeoAnalysis.seoScore);
    expect(data.analysis.aiSuggestions).toBeNull();
  });
});
