import assert from "node:assert/strict";
import { calculateIntervention } from "./interventionService.js";

const lowResult = calculateIntervention({
  riskLevel: "Low",
  escalation: {
    status: "Stable",
  },
});

assert.equal(lowResult.priority, "Low");
assert.equal(lowResult.recommendations.length, 1);
assert.equal(
  lowResult.recommendations[0].type,
  "Monitoring"
);


const moderateResult = calculateIntervention({
  riskLevel: "Moderate",
  escalation: {
    status: "Stable",
  },
});

assert.equal(moderateResult.priority, "Moderate");
assert.equal(
  moderateResult.recommendations[0].type,
  "Follow-up"
);


const highResult = calculateIntervention({
  riskLevel: "High",
  escalation: {
    status: "Watch",
  },
});

assert.equal(highResult.priority, "High");
assert.equal(
  highResult.recommendations[0].type,
  "Human Review"
);


const escalatingResult = calculateIntervention({
  riskLevel: "High",
  escalation: {
    status: "Escalating",
  },
});

assert.equal(escalatingResult.recommendations.length, 2);
assert.equal(
  escalatingResult.recommendations[1].type,
  "Escalation Follow-up"
);


const criticalResult = calculateIntervention({
  riskLevel: "Critical",
  escalation: {
    status: "Critical Escalation",
  },
});

assert.equal(criticalResult.priority, "Critical");
assert.equal(criticalResult.recommendations.length, 2);
assert.equal(
  criticalResult.recommendations[0].type,
  "Urgent Human Review"
);

console.log("All intervention recommendation tests passed!");