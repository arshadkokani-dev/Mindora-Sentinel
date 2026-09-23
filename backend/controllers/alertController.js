import Alert from "../models/Alert.js";
import { createAuditLog } from "../services/auditService.js";

const findAlert = async (req, res) => {
  const alert = await Alert.findById(req.params.alertId);

  if (!alert) {
    res.status(404).json({
      message: "Alert not found",
    });
    return null;
  }

  return alert;
};

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("caseId", "name email")
      .populate("reviewer", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await findAlert(req, res);

    if (!alert) return;

    if (alert.status !== "Active") {
      return res.status(400).json({
        message: "Only active alerts can be acknowledged",
      });
    }

    alert.status = "Acknowledged";
    alert.reviewer = req.userId;
    alert.acknowledgedAt = new Date();

    await alert.save();

    await createAuditLog({
      actor: req.userId,
      actorRole: req.userRole,
      action: "ALERT_ACKNOWLEDGED",
      caseId: alert.caseId,
      details: `Alert acknowledged: ${alert.type}.`,
    });

    res.status(200).json({
      message: "Alert acknowledged",
      alert,
    });
  } catch (error) {
    console.error("Acknowledge alert error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const reviewAlert = async (req, res) => {
  try {
    const alert = await findAlert(req, res);

    if (!alert) return;

    if (
      alert.status !== "Acknowledged"
    ) {
      return res.status(400).json({
        message:
          "Only acknowledged alerts can be moved under review",
      });
    }

    alert.status = "Under Review";
    alert.reviewer = req.userId;
    alert.reviewStartedAt = new Date();

    await alert.save();

    await createAuditLog({
      actor: req.userId,
      actorRole: req.userRole,
      action: "ALERT_REVIEW_STARTED",
      caseId: alert.caseId,
      details: `Alert moved under review: ${alert.type}.`,
    });

    res.status(200).json({
      message: "Alert moved under review",
      alert,
    });
  } catch (error) {
    console.error("Review alert error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const alert = await findAlert(req, res);

    if (!alert) return;

    if (
      alert.status !== "Under Review"
    ) {
      return res.status(400).json({
        message:
          "Only alerts under review can be resolved",
      });
    }

    alert.status = "Resolved";
    alert.reviewer = req.userId;
    alert.resolvedAt = new Date();
    alert.actionNote = req.body.actionNote || "";

    await alert.save();

    await createAuditLog({
      actor: req.userId,
      actorRole: req.userRole,
      action: "ALERT_RESOLVED",
      caseId: alert.caseId,
      details: `Alert resolved: ${alert.type}.`,
    });

    res.status(200).json({
      message: "Alert resolved",
      alert,
    });
  } catch (error) {
    console.error("Resolve alert error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};