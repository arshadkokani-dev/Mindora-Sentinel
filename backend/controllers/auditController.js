import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { caseId } = req.query;

    const filter = caseId ? { caseId } : {};

    const auditLogs = await AuditLog.find(filter)
      .populate("actor", "name email role")
      .populate("caseId", "name email")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.status(200).json({
      auditLogs,
    });
  } catch (error) {
    console.error("Get audit logs error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};