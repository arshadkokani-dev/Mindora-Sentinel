import Alert from "../models/Alert.js";

export const createOrUpdateAlert = async ({
  caseId,
  riskAlert,
}) => {
  if (!riskAlert?.alert) {
    return null;
  }

  const existingAlert = await Alert.findOne({
    caseId,
    type: riskAlert.type,
    status: {
      $in: ["Active", "Acknowledged", "Under Review"],
    },
  });

  if (existingAlert) {
    existingAlert.severity = riskAlert.severity;
    existingAlert.reasons = riskAlert.reasons;
    await existingAlert.save();

    return existingAlert;
  }

  return Alert.create({
    caseId,
    type: riskAlert.type,
    severity: riskAlert.severity,
    reasons: riskAlert.reasons,
  });
};