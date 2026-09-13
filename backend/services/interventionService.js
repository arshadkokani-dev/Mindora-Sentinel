export const calculateIntervention = ({
  riskLevel,
  escalation,
}) => {
  const recommendations = [];

  if (!riskLevel) {
    return {
      priority: "Low",
      recommendations: [],
    };
  }

  /*
   * Low risk
   */
  if (riskLevel === "Low") {
    recommendations.push({
      type: "Monitoring",
      title: "Continue regular check-ins",
      action:
        "Encourage continued wellness check-ins and routine engagement.",
      reason:
        "Current distress is in the Low range with no immediate escalation indicated.",
    });
  }

  /*
   * Moderate risk
   */
  else if (riskLevel === "Moderate") {
    recommendations.push({
      type: "Follow-up",
      title: "Increase monitoring",
      action:
        "Encourage a follow-up check-in and review recent changes in wellbeing.",
      reason:
        "Current distress is in the Moderate range and may benefit from closer monitoring.",
    });
  }

  /*
   * High risk
   */
  else if (riskLevel === "High") {
    recommendations.push({
      type: "Human Review",
      title: "Prioritize human review",
      action:
        "Route the case for review by an authorized counsellor or caseworker.",
      reason:
        "Current distress is in the High range and warrants additional human oversight.",
    });
  }

  /*
   * Critical risk
   */
  else if (riskLevel === "Critical") {
    recommendations.push({
      type: "Urgent Human Review",
      title: "Prioritize immediate human review",
      action:
        "Route the case to the appropriate authorized support workflow for prompt human assessment.",
      reason:
        "Current distress is in the Critical range and requires prompt human attention.",
    });
  }

  /*
   * Escalation overlay
   */
  if (
    escalation &&
    (escalation.status === "Escalating" ||
      escalation.status === "Critical Escalation")
  ) {
    recommendations.push({
      type: "Escalation Follow-up",
      title: "Review the worsening pattern",
      action:
        "Review recent check-ins and escalation evidence with the authorized support team.",
      reason:
        "Recent distress patterns indicate worsening over time.",
    });
  }

  return {
    priority:
      riskLevel === "Critical"
        ? "Critical"
        : riskLevel === "High"
        ? "High"
        : riskLevel === "Moderate"
        ? "Moderate"
        : "Low",
    recommendations,
  };
};