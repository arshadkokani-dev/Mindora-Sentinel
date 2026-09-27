import Intervention from "../models/Intervention.js";

export const createIntervention = async ({
  caseId,
  type,
  title,
  description = "",
  assignedTo = null,
  priority,
}) => {
  return Intervention.create({
    caseId,
    type,
    title,
    description,
    assignedTo,
    priority,
    status: "Assigned",
  });
};

export const updateInterventionStatus = async ({
  interventionId,
  status,
  actionNote = "",
  jurisdictionLevel,
  state,
  district,
}) => {
  const intervention = await Intervention.findById(interventionId);

  if (!intervention) {
    throw new Error("Intervention not found");
  }

  const caseUser = await User.findOne({
    _id: intervention.caseId,
    role: "victim",
  }).select("state district");

  if (!caseUser) {
    throw new Error("Case not found");
  }

  if (
    jurisdictionLevel === "district" &&
    (caseUser.state !== state || caseUser.district !== district)
  ) {
    throw new Error("Access denied for this jurisdiction");
  }

  if (
    jurisdictionLevel === "state" &&
    caseUser.state !== state
  ) {
    throw new Error("Access denied for this jurisdiction");
  }

  intervention.status = status;

  if (actionNote) {
    intervention.actionNote = actionNote;
  }

  if (status === "Completed") {
    intervention.completedAt = new Date();
  }

  await intervention.save();

  return intervention;
};