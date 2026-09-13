export const calculateRiskAlert = (entries, escalation) => {
  if (!entries || entries.length === 0) {
    return {
      alert: false,
      type: null,
      severity: "Low",
      reasons: [],
    };
  }

  const latestEntry = entries[entries.length - 1];

  const latestScore = latestEntry.distressScore;
  const latestRisk = latestEntry.riskLevel;

  const reasons = [];

  // Critical current distress
  if (latestScore >= 75) {
    reasons.push(
      `Current distress score is ${latestScore}, which is in the Critical range.`
    );

    return {
      alert: true,
      type: "Critical Risk",
      severity: "Critical",
      reasons,
    };
  }

  // Critical escalation
  if (escalation?.status === "Critical Escalation") {
    reasons.push(
      "A critical escalation pattern has been detected across recent check-ins."
    );

    return {
      alert: true,
      type: "Critical Escalation",
      severity: "Critical",
      reasons,
    };
  }

  // Escalating distress
  if (escalation?.status === "Escalating") {
    reasons.push(
      "Distress has increased consistently across recent check-ins."
    );

    return {
      alert: true,
      type: "Escalation Warning",
      severity: latestScore >= 50 ? "High" : "Moderate",
      reasons,
    };
  }

  // Repeated high-risk states
  if (
    escalation?.highRiskCount >= 2 &&
    latestRisk === "High"
  ) {
    reasons.push(
      `${escalation.highRiskCount} recent check-ins show High or Critical risk.`
    );

    return {
      alert: true,
      type: "Persistent High Distress",
      severity: "High",
      reasons,
    };
  }

  // No actionable alert
  return {
    alert: false,
    type: null,
    severity: latestRisk === "High" ? "Moderate" : "Low",
    reasons: [
      "Current distress does not meet the configured alert conditions.",
    ],
  };
};