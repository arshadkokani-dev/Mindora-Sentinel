import User from "../models/User.js";

const validStatuses = [
  "Open",
  "Under Review",
  "Active Support",
  "Resolved",
  "Closed",
];

export const updateCaseStatus = async ({
  caseId,
  status,
}) => {
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid case status");
  }

  const caseUser = await User.findOne({
    _id: caseId,
    role: "victim",
  });

  if (!caseUser) {
    throw new Error("Case not found");
  }

  caseUser.caseStatus = status;

  await caseUser.save();

  return caseUser;
};