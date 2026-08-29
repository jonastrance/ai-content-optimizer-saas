import { describe, it, expect } from 'vitest';
import { getPlanById, pricingPlans } from '../pricing';

describe('getPlanById', () => {
  it('should return the correct plan for valid plan IDs', () => {
    // Happy paths
    expect(getPlanById('starter')).toEqual(pricingPlans.find(p => p.id === 'starter'));
    expect(getPlanById('professional')).toEqual(pricingPlans.find(p => p.id === 'professional'));
    expect(getPlanById('enterprise')).toEqual(pricingPlans.find(p => p.id === 'enterprise'));
  });

  it('should return undefined for invalid plan IDs', () => {
    // Edge cases and error conditions
    expect(getPlanById('unknown')).toBeUndefined();
    expect(getPlanById('')).toBeUndefined();
    expect(getPlanById('STARTER')).toBeUndefined(); // case sensitivity
  });
});
