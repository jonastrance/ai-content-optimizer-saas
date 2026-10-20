import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock the modules
vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

vi.mock('@/lib/seo-analyzer', () => ({
  analyzeSEO: vi.fn(() => ({ score: 85 })),
}));

vi.mock('@/lib/openai-service', () => ({
  getAIContentSuggestions: vi.fn(() => ['Suggestion 1', 'Suggestion 2']),
}));

import { getToken } from 'next-auth/jwt';

describe('POST /api/analyze', () => {
  it('returns 401 if unauthenticated', async () => {
    // Mock token to be null
    (getToken as any).mockResolvedValueOnce(null);

    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content: 'test content', targetKeyword: 'test' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('proceeds if authenticated', async () => {
    // Mock token to be present
    (getToken as any).mockResolvedValueOnce({ sub: 'user-123' });

    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content: 'test content', targetKeyword: 'test' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis.aiSuggestions).toBeDefined();
  });
});
