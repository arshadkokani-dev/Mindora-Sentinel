export const calculateCasePriority = ({
  riskLevel,
  escalation,
  riskAlert,
  checkInStatus,
}) => {
  if (riskAlert?.severity === "Critical" || riskLevel === "Critical") {
    return "Critical";
  }

  if (
    riskLevel === "High" ||
    escalation?.status === "Escalating" ||
    escalation?.status === "Critical Escalation"
  ) {
    return "High";
  }

  if (
    riskLevel === "Moderate" ||
    riskAlert?.alert ||
    checkInStatus?.status === "Overdue"
  ) {
    return "Medium";
  }

  return "Low";
};