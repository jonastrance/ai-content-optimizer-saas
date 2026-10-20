import { describe, it, expect, vi } from 'vitest';
import { POST } from '../app/api/auth/register/route';

vi.mock('../lib/prisma', () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com' }),
      },
    },
  };
});

describe('Register API', () => {
  it('should create a user', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
