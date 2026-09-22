import User from "../models/User.js";
import WellnessEntry from "../models/WellnessEntry.js";
import CBTJournal from "../models/CBTJournal.js";

import { calculateEscalation } from "../services/escalationService.js";
import { calculateRiskAlert } from "../services/alertService.js";
import { calculateIntervention } from "../services/interventionService.js";
import { calculateEngagement } from "../services/engagementService.js";
import { calculateCheckInStatus } from "../services/checkInService.js";
import { calculateCasePriority } from "../services/casePriorityService.js";
import { createOrUpdateAlert } from "../services/alertManagementService.js";

export const getCommandCenter = async (req, res) => {
  try {
    const users = await User.find({
      role: "victim",
    })
      .select("_id name email createdAt caseStatus district state country")
      .lean();

    const victimIds = users.map((user) => user._id);

    const wellnessEntries = await WellnessEntry.find({
      user: { $in: victimIds },
    })
      .sort({ date: 1 })
      .lean();

    const journalEntries = await CBTJournal.find({
      user: { $in: victimIds },
    })
      .select("user date")
      .sort({ date: 1 })
      .lean();

    const cases = await Promise.all(
    users.map(async (user) => {
      const userWellnessEntries = wellnessEntries.filter(
        (entry) =>
          entry.user.toString() === user._id.toString()
      );

      const userJournalEntries = journalEntries.filter(
        (entry) =>
          entry.user.toString() === user._id.toString()
      );

      const latestEntry =
        userWellnessEntries[
          userWellnessEntries.length - 1
        ] || null;

      const escalation = calculateEscalation(
        userWellnessEntries
      );

      const riskAlert = calculateRiskAlert(
        userWellnessEntries,
        escalation
      );

      await createOrUpdateAlert({
        caseId: user._id,
        riskAlert,
      });

      const intervention = calculateIntervention({
        riskLevel: latestEntry?.riskLevel,
        escalation,
      });

      const engagement = calculateEngagement({
        wellnessEntries: userWellnessEntries,
        journalEntries: userJournalEntries,
      });

      const checkInStatus = calculateCheckInStatus({
        wellnessEntries: userWellnessEntries,
      });

      const priority = calculateCasePriority({
        riskLevel: latestEntry?.riskLevel,
        escalation,
        riskAlert,
        checkInStatus,
      });

      return {
        caseId: user._id,
        name: user.name,
        email: user.email,
        priority: priority,
        caseStatus: user.caseStatus,
        district: user.district || "",
        state: user.state || "",
        country: user.country || "India",

        latestDistressScore:
          latestEntry?.distressScore ?? null,

        riskLevel:
          latestEntry?.riskLevel ?? "No Data",

        lastCheckIn:
          latestEntry?.date ?? null,

        totalCheckIns:
          userWellnessEntries.length,

        escalation: {
          status: escalation.status,
          severity: escalation.severity,
          scoreChange: escalation.scoreChange,
          consecutiveIncrease:
            escalation.consecutiveIncrease,
          highRiskCount:
            escalation.highRiskCount,
        },

        riskAlert: {
          alert: riskAlert.alert,
          type: riskAlert.type,
          severity: riskAlert.severity,
          reasons: riskAlert.reasons,
        },

        intervention: {
          priority: intervention.priority,
          recommendations:
            intervention.recommendations,
        },

        engagement: {
          status: engagement.status,
          trend: engagement.trend,
          totalCheckIns:
            engagement.totalCheckIns,
          totalJournalEntries:
            engagement.totalJournalEntries,
          lastInteraction:
            engagement.lastInteraction,
          daysSinceLastInteraction:
            engagement.daysSinceLastInteraction,
        },

        checkInStatus: {
          status: checkInStatus.status,
          intervalDays:
            checkInStatus.intervalDays,
          lastCheckIn:
            checkInStatus.lastCheckIn,
          nextCheckInDue:
            checkInStatus.nextCheckInDue,
          daysUntilDue:
            checkInStatus.daysUntilDue,
          daysOverdue:
            checkInStatus.daysOverdue,
        },
      };
    })
  );

    const hierarchy = {
      national: {
        country: "India",
        totalCases: cases.length,
      },
      states: {},
    };

    cases.forEach((caseItem) => {
      const state = caseItem.state || "Unassigned";
      const district = caseItem.district || "Unassigned";

      if (!hierarchy.states[state]) {
        hierarchy.states[state] = {
          state,
          totalCases: 0,
          districts: {},
        };
      }

      hierarchy.states[state].totalCases += 1;

      if (!hierarchy.states[state].districts[district]) {
        hierarchy.states[state].districts[district] = {
          district,
          totalCases: 0,
        };
      }

      hierarchy.states[state].districts[district].totalCases += 1;
    });
    
    const summary = {
      totalCases: cases.length,

      lowRisk: cases.filter(
        (caseItem) =>
          caseItem.riskLevel === "Low"
      ).length,

      moderateRisk: cases.filter(
        (caseItem) =>
          caseItem.riskLevel === "Moderate"
      ).length,

      highRisk: cases.filter(
        (caseItem) =>
          caseItem.riskLevel === "High"
      ).length,

      criticalRisk: cases.filter(
        (caseItem) =>
          caseItem.riskLevel === "Critical"
      ).length,

      noData: cases.filter(
        (caseItem) =>
          caseItem.riskLevel === "No Data"
      ).length,

      activeAlerts: cases.filter(
        (caseItem) =>
          caseItem.riskAlert.alert
      ).length,

      escalatingCases: cases.filter(
        (caseItem) =>
          caseItem.escalation.status ===
            "Escalating" ||
          caseItem.escalation.status ===
            "Critical Escalation"
      ).length,

      overdueCheckIns: cases.filter(
        (caseItem) =>
          caseItem.checkInStatus.status ===
          "Overdue"
      ).length,
    };

    res.status(200).json({
      summary,
      cases,
      hierarchy,
    });
  } catch (error) {
    console.error(
      "Command Center error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getCaseDetails = async (req, res) => {
  try {
    const { caseId } = req.params

    const user = await User.findOne({
      _id: caseId,
      role: "victim",
    })
      .select("_id name email createdAt caseStatus")
      .lean()

    if (!user) {
      return res.status(404).json({
        message: "Case not found",
      })
    }

    const wellnessEntries = await WellnessEntry.find({
      user: user._id,
    })
      .sort({ date: 1 })
      .lean()

    const journalEntries = await CBTJournal.find({
      user: user._id,
    })
      .select("date")
      .sort({ date: 1 })
      .lean()

    const latestEntry =
      wellnessEntries[wellnessEntries.length - 1] || null

    const escalation = calculateEscalation(
      wellnessEntries
    )

    const riskAlert = calculateRiskAlert(
      wellnessEntries,
      escalation
    )

    const intervention = calculateIntervention({
      riskLevel: latestEntry?.riskLevel,
      escalation,
    })

    const engagement = calculateEngagement({
      wellnessEntries,
      journalEntries,
    })

    const checkInStatus = calculateCheckInStatus({
      wellnessEntries,
    })

    res.status(200).json({
      case: {
        caseId: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        caseStatus: user.caseStatus,

        latestDistressScore:
          latestEntry?.distressScore ?? null,

        riskLevel:
          latestEntry?.riskLevel ?? "No Data",

        lastCheckIn:
          latestEntry?.date ?? null,

        totalCheckIns:
          wellnessEntries.length,

        escalation: {
          status: escalation.status,
          severity: escalation.severity,
          scoreChange: escalation.scoreChange,
          consecutiveIncrease:
            escalation.consecutiveIncrease,
          highRiskCount:
            escalation.highRiskCount,
          reasons:
            escalation.reasons,
        },

        riskAlert: {
          alert: riskAlert.alert,
          type: riskAlert.type,
          severity: riskAlert.severity,
          reasons: riskAlert.reasons,
        },

        intervention: {
          priority: intervention.priority,
          recommendations:
            intervention.recommendations,
        },

        engagement: {
          status: engagement.status,
          trend: engagement.trend,
          totalCheckIns:
            engagement.totalCheckIns,
          totalJournalEntries:
            engagement.totalJournalEntries,
          lastInteraction:
            engagement.lastInteraction,
          daysSinceLastInteraction:
            engagement.daysSinceLastInteraction,
        },

        checkInStatus: {
          status: checkInStatus.status,
          intervalDays:
            checkInStatus.intervalDays,
          lastCheckIn:
            checkInStatus.lastCheckIn,
          nextCheckInDue:
            checkInStatus.nextCheckInDue,
          daysUntilDue:
            checkInStatus.daysUntilDue,
          daysOverdue:
            checkInStatus.daysOverdue,
        },
      },

      timeline: wellnessEntries.map((entry) => ({
        id: entry._id,
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy,
        sleep: entry.sleep,
        stress: entry.stress,
        anxiety: entry.anxiety,
        emotion: entry.emotion,
        distressScore:
          entry.distressScore ?? null,
        riskLevel:
          entry.riskLevel ?? "No Data",
      })),
    })
  } catch (error) {
    console.error(
      "Case details error:",
      error.message
    )

    res.status(500).json({
      message: "Server error",
    })
  }
}