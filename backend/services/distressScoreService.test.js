import assert from "node:assert/strict";
import { calculateDistressScore } from "./distressScoreService.js";

const healthyResult = calculateDistressScore({
  mood: 10,
  energy: 10,
  sleep: 10,
  stress: 1,
  anxiety: 1,
});

assert.equal(healthyResult.distressScore, 0);
assert.equal(healthyResult.riskLevel, "Low");

const severeResult = calculateDistressScore({
  mood: 1,
  energy: 1,
  sleep: 1,
  stress: 10,
  anxiety: 10,
});

assert.equal(severeResult.distressScore, 100);
assert.equal(severeResult.riskLevel, "Critical");

console.log("All distress score tests passed!");