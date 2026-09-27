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
  jurisdictionLevel,
  state,
  district,
}) => {
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid case status");
  }

  const caseFilter = {
    _id: caseId,
    role: "victim",
  };

  if (jurisdictionLevel === "district") {
    caseFilter.state = state;
    caseFilter.district = district;
  }

  if (jurisdictionLevel === "state") {
    caseFilter.state = state;
  }

  const caseUser = await User.findOne(caseFilter);

  if (!caseUser) {
    throw new Error("Case not found");
  }

  caseUser.caseStatus = status;

  await caseUser.save();

  return caseUser;
};