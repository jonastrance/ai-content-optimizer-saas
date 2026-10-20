import { describe, it, expect } from "vitest";
import { getPlanById, getPlanLimits } from "../pricing";

describe("Pricing Functions", () => {
  describe("getPlanById", () => {
    it("should return the correct plan for a valid planId", () => {
      const plan = getPlanById("starter");
      expect(plan).toBeDefined();
      expect(plan?.id).toBe("starter");
      expect(plan?.name).toBe("Starter");
    });

    it("should return undefined for an invalid planId", () => {
      const plan = getPlanById("invalid-plan");
      expect(plan).toBeUndefined();
    });
  });

  describe("getPlanLimits", () => {
    it("should return the correct limit for a valid planId", () => {
      const limit = getPlanLimits("starter");
      expect(limit).toBe(50);
    });

    it("should return 0 for an invalid planId", () => {
      const limit = getPlanLimits("invalid-plan");
      expect(limit).toBe(0);
    });

    it("should handle plans with unlimited limits correctly", () => {
      const limit = getPlanLimits("enterprise");
      expect(limit).toBe(-1); // -1 is defined as unlimited
    });
  });
});
