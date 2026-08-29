import { NextRequest } from 'next/server';
import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/analyze', () => {
  it('returns 400 when content is missing', async () => {
    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Content is required and must be a string');
  });

  it('returns 400 when content is not a string', async () => {
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
