import assert from "node:assert/strict";
import { calculateEscalation } from "./escalationService.js";

/*
 * Stable
 */
const stable = calculateEscalation([
  { distressScore: 42, riskLevel: "Moderate" },
  { distressScore: 44, riskLevel: "Moderate" },
  { distressScore: 43, riskLevel: "Moderate" },
]);

assert.equal(stable.status, "Stable");

/*
 * Improving
 */
const improving = calculateEscalation([
  { distressScore: 72, riskLevel: "High" },
  { distressScore: 61, riskLevel: "High" },
  { distressScore: 48, riskLevel: "Moderate" },
]);

assert.equal(improving.status, "Improving");

/*
 * Watch
 */
const watch = calculateEscalation([
  { distressScore: 42, riskLevel: "Moderate" },
  { distressScore: 48, riskLevel: "Moderate" },
  { distressScore: 50, riskLevel: "High" },
]);

assert.equal(watch.status, "Watch");

/*
 * Escalating
 */
const escalating = calculateEscalation([
  { distressScore: 45, riskLevel: "Moderate" },
  { distressScore: 59, riskLevel: "High" },
  { distressScore: 68, riskLevel: "High" },
]);

assert.equal(escalating.status, "Escalating");

/*
 * Critical Escalation
 */
const critical = calculateEscalation([
  { distressScore: 68, riskLevel: "High" },
  { distressScore: 78, riskLevel: "Critical" },
  { distressScore: 86, riskLevel: "Critical" },
]);

assert.equal(critical.status, "Critical Escalation");

console.log("All escalation tests passed!");