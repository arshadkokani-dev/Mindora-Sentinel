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
}) => {
  const intervention = await Intervention.findById(interventionId);

  if (!intervention) {
    throw new Error("Intervention not found");
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