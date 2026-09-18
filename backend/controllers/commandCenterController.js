import User from "../models/User.js";
import WellnessEntry from "../models/WellnessEntry.js";

export const getCommandCenter = async (req, res) => {
  try {
    const authorizedRoles = ["caseworker", "counsellor", "admin"];

    if (!authorizedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "You do not have permission to access the Command Center",
      });
    }

    const users = await User.find({
      role: "victim",
    }).select("_id name email role createdAt");

    const victimIds = users.map((user) => user._id);

    const entries = await WellnessEntry.find({
      user: { $in: victimIds },
    })
      .sort({ date: -1 })
      .lean();

    const cases = users.map((user) => {
      const userEntries = entries.filter(
        (entry) => entry.user.toString() === user._id.toString()
      );

      const latestEntry = userEntries[0] || null;

      return {
        caseId: user._id,
        name: user.name,
        email: user.email,
        latestDistressScore: latestEntry?.distressScore ?? null,
        riskLevel: latestEntry?.riskLevel ?? "No Data",
        lastCheckIn: latestEntry?.date ?? null,
        totalCheckIns: userEntries.length,
      };
    });

    const summary = {
      totalCases: cases.length,

      lowRisk: cases.filter(
        (caseItem) => caseItem.riskLevel === "Low"
      ).length,

      moderateRisk: cases.filter(
        (caseItem) => caseItem.riskLevel === "Moderate"
      ).length,

      highRisk: cases.filter(
        (caseItem) => caseItem.riskLevel === "High"
      ).length,

      criticalRisk: cases.filter(
        (caseItem) => caseItem.riskLevel === "Critical"
      ).length,

      noData: cases.filter(
        (caseItem) => caseItem.riskLevel === "No Data"
      ).length,
    };

    res.status(200).json({
      summary,
      cases,
    });
  } catch (error) {
    console.error("Command Center error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};