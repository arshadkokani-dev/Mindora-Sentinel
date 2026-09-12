import WellnessEntry from "../models/WellnessEntry.js";
import { calculateDistressScore } from "../services/distressScoreService.js";
import { calculateDistressTrend } from "../services/distressTrendService.js";


export const createWellnessEntry = async (req, res) => {
  try {
    const {
      mood,
      energy,
      sleep,
      stress,
      anxiety,
      gratitude,
      highlight,
      journal,
      emotion,
      date,

    } = req.body;

    const { distressScore, riskLevel } = calculateDistressScore({
      mood,
      energy,
      sleep,
      stress,
      anxiety,
    });

    const entry = await WellnessEntry.create({
      user: req.userId,
      mood,
      energy,
      sleep,
      stress,
      anxiety,
      gratitude,
      highlight,
      journal,
      emotion,
      date,
      distressScore,
      riskLevel,
    });

    res.status(201).json({
      message: "Wellness entry created successfully",
      entry,
    });
  } catch (error) {
    console.error("Create wellness entry error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getWellnessEntries = async (req, res) => {
  try {
    const entries = await WellnessEntry.find({
      user: req.userId,
    }).sort({ date: -1 });

    const distressTrend = calculateDistressTrend(entries);

    res.status(200).json({
      entries,
      distressTrend,
    });
  } catch (error) {
    console.error("Get wellness entries error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateWellnessEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await WellnessEntry.findOneAndUpdate(
      {
        _id: id,
        user: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!entry) {
      return res.status(404).json({
        message: "Wellness entry not found",
      });
    }

    res.status(200).json({
      message: "Wellness entry updated successfully",
      entry,
    });
  } catch (error) {
    console.error("Update wellness entry error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteWellnessEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await WellnessEntry.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Wellness entry not found",
      });
    }

    res.status(200).json({
      message: "Wellness entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete wellness entry error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};