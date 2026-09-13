import assert from "node:assert/strict";
import { calculateRiskReasoning } from "./riskReasoningService.js";

// 1. High contributing factors
const highResult = calculateRiskReasoning({
  mood: 3,
  energy: 4,
  sleep: 3,
  stress: 8,
  anxiety: 9,
});

assert.equal(highResult.factorCount, 5);

assert.equal(highResult.factors[0].factor, "Stress");
assert.equal(highResult.factors[0].impact, "High");

assert.equal(highResult.factors[1].factor, "Anxiety");
assert.equal(highResult.factors[1].impact, "High");

// 2. Moderate contributing factors
const moderateResult = calculateRiskReasoning({
  mood: 6,
  energy: 6,
  sleep: 6,
  stress: 5,
  anxiety: 5,
});

assert.equal(moderateResult.factorCount, 5);

moderateResult.factors.forEach((factor) => {
  assert.equal(factor.impact, "Moderate");
});

// 3. Healthy inputs → no contributing risk factors
const healthyResult = calculateRiskReasoning({
  mood: 10,
  energy: 10,
  sleep: 10,
  stress: 1,
  anxiety: 1,
});

assert.equal(healthyResult.factorCount, 0);
assert.deepEqual(healthyResult.factors, []);

console.log("All risk reasoning tests passed!");