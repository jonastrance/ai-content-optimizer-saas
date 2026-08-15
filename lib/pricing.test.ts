import { getPlanById, getPlanLimits } from './pricing';

describe('Pricing utilities', () => {
  describe('getPlanById', () => {
    it('should return the correct plan for valid plan IDs', () => {
      const starterPlan = getPlanById('starter');
      expect(starterPlan).toBeDefined();
      expect(starterPlan?.id).toBe('starter');
      expect(starterPlan?.name).toBe('Starter');

      const proPlan = getPlanById('professional');
      expect(proPlan).toBeDefined();
      expect(proPlan?.id).toBe('professional');

      const enterprisePlan = getPlanById('enterprise');
      expect(enterprisePlan).toBeDefined();
      expect(enterprisePlan?.id).toBe('enterprise');
    });

    it('should return undefined for invalid plan IDs', () => {
      const invalidPlan = getPlanById('nonexistent-plan');
      expect(invalidPlan).toBeUndefined();

      const emptyPlanId = getPlanById('');
      expect(emptyPlanId).toBeUndefined();
    });
  });

  describe('getPlanLimits', () => {
    it('should return the correct analysis limit for valid plan IDs', () => {
      expect(getPlanLimits('starter')).toBe(50);
      expect(getPlanLimits('professional')).toBe(200);
      expect(getPlanLimits('enterprise')).toBe(-1);
    });

    it('should return 0 for invalid plan IDs', () => {
      expect(getPlanLimits('nonexistent-plan')).toBe(0);
      expect(getPlanLimits('')).toBe(0);
    });
  });
});
