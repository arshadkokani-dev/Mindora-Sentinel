import assert from "node:assert/strict";
import { calculateRiskAlert } from "./alertService.js";

// 1. High score once → no alert
const normalHighResult = calculateRiskAlert(
  [
    {
      distressScore: 51,
      riskLevel: "High",
    },
  ],
  {
    status: "Stable",
    highRiskCount: 1,
  }
);

assert.equal(normalHighResult.alert, false);

// 2. Critical distress → critical alert
const criticalResult = calculateRiskAlert(
  [
    {
      distressScore: 82,
      riskLevel: "Critical",
    },
  ],
  {
    status: "Stable",
    highRiskCount: 1,
  }
);

assert.equal(criticalResult.alert, true);
assert.equal(criticalResult.type, "Critical Risk");
assert.equal(criticalResult.severity, "Critical");

// 3. Escalating distress → escalation warning
const escalatingResult = calculateRiskAlert(
  [
    { distressScore: 45, riskLevel: "Moderate" },
    { distressScore: 59, riskLevel: "High" },
    { distressScore: 68, riskLevel: "High" },
  ],
  {
    status: "Escalating",
    highRiskCount: 2,
  }
);

assert.equal(escalatingResult.alert, true);
assert.equal(escalatingResult.type, "Escalation Warning");

// 4. Repeated high-risk states → persistent high distress
const persistentResult = calculateRiskAlert(
  [
    { distressScore: 61, riskLevel: "High" },
    { distressScore: 64, riskLevel: "High" },
    { distressScore: 68, riskLevel: "High" },
  ],
  {
    status: "Watch",
    highRiskCount: 3,
  }
);

assert.equal(persistentResult.alert, true);
assert.equal(
  persistentResult.type,
  "Persistent High Distress"
);

console.log("All risk alert tests passed!");