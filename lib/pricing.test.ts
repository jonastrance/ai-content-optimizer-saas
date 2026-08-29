import { describe, it, expect } from 'vitest';
import { getPlanLimits } from './pricing';

describe('getPlanLimits', () => {
  it('should return 50 for the starter plan', () => {
    expect(getPlanLimits('starter')).toBe(50);
  });

  it('should return 200 for the professional plan', () => {
    expect(getPlanLimits('professional')).toBe(200);
  });

  it('should return -1 for the enterprise plan (unlimited)', () => {
    expect(getPlanLimits('enterprise')).toBe(-1);
  });

  it('should return 0 for an unknown plan id', () => {
    expect(getPlanLimits('unknown-plan')).toBe(0);
  });

  it('should return 0 for an empty string plan id', () => {
    expect(getPlanLimits('')).toBe(0);
  });
});
