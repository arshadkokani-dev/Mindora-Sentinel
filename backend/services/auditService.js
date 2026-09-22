import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
  actor,
  actorRole,
  action,
  caseId = null,
  details = "",
}) => {
  if (!actor || !actorRole || !action) {
    return null;
  }

  return AuditLog.create({
    actor,
    actorRole,
    action,
    caseId,
    details,
  });
};