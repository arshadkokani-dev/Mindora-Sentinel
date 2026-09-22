import {
  updateCaseStatus,
} from "../services/caseLifecycleService.js";
import { createAuditLog } from "../services/auditService.js";

export const updateCaseLifecycle = async (req, res) => {
  try {
    const { status } = req.body;

    const caseUser = await updateCaseStatus({
        caseId: req.params.caseId,
        status,
      });

      await createAuditLog({
        actor: req.userId,
        actorRole: req.userRole,
        action: "CASE_STATUS_UPDATED",
        caseId: caseUser._id,
        details: `Case status changed to ${caseUser.caseStatus}.`,
      });

      res.status(200).json({
      message: "Case status updated",
      case: {
        caseId: caseUser._id,
        name: caseUser.name,
        email: caseUser.email,
        caseStatus: caseUser.caseStatus,
      },
    });
  } catch (error) {
    console.error("Update case lifecycle error:", error.message);

    if (
      error.message === "Invalid case status" ||
      error.message === "Case not found"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};