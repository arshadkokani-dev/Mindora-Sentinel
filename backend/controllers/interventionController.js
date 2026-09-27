import Intervention from "../models/Intervention.js";
import User from "../models/User.js";
import {
  createIntervention,
  updateInterventionStatus,
} from "../services/interventionManagementService.js";

export const getInterventions = async (req, res) => {
  try {
    const cases = await User.find({
        role: "victim",
        ...(req.userJurisdictionLevel === "district"
          ? {
              state: req.userState,
              district: req.userDistrict,
            }
          : {}),
        ...(req.userJurisdictionLevel === "state"
          ? {
              state: req.userState,
            }
          : {}),
      }).select("_id");

      const caseIds = cases.map((caseUser) => caseUser._id);

      const interventions = await Intervention.find({
        caseId: { $in: caseIds },
      })
      .populate("caseId", "name email")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ interventions });
  } catch (error) {
    console.error("Get interventions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCaseIntervention = async (req, res) => {
  try {
    const {
      caseId,
      type,
      title,
      description,
      assignedTo,
      priority,
    } = req.body;

    if (!caseId || !type || !title || !priority) {
      return res.status(400).json({
        message: "caseId, type, title, and priority are required",
      });
    }

    const caseFilter = {
      _id: caseId,
      role: "victim",
    };

    if (req.userJurisdictionLevel === "district") {
      caseFilter.state = req.userState;
      caseFilter.district = req.userDistrict;
    }

    if (req.userJurisdictionLevel === "state") {
      caseFilter.state = req.userState;
    }

    const caseUser = await User.findOne(caseFilter).select("_id");

    if (!caseUser) {
      return res.status(403).json({
        message: "Access denied for this jurisdiction",
      });
    }

    const intervention = await createIntervention({
      caseId,
      type,
      title,
      description,
      assignedTo,
      priority,
    });
    res.status(201).json({
      message: "Intervention created",
      intervention,
    });
  } catch (error) {
    console.error("Create intervention error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCaseIntervention = async (req, res) => {
  try {
    const { status, actionNote } = req.body;

    if (!["Assigned", "In Progress", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid intervention status",
      });
    }

    const intervention = await updateInterventionStatus({
      interventionId: req.params.interventionId,
      status,
      actionNote,
      jurisdictionLevel: req.userJurisdictionLevel,
      state: req.userState,
      district: req.userDistrict,
    });

    res.status(200).json({
      message: "Intervention updated",
      intervention,
    });
  } catch (error) {
    console.error("Update intervention error:", error.message);

    if (error.message === "Access denied for this jurisdiction") {
      return res.status(403).json({
        message: error.message,
      });
    }

    if (error.message === "Intervention not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};