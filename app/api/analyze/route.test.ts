import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/seo-analyzer', () => ({
  analyzeSEO: vi.fn(),
}));

vi.mock('@/lib/openai-service', () => ({
  getAIContentSuggestions: vi.fn(),
}));

describe('POST /api/analyze', () => {
  it('should return 400 if body is empty', async () => {
    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Content is required and must be a string');
  });

  it('should return 400 if content is not a string', async () => {
    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content: 123 }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Content is required and must be a string');
  });
});
