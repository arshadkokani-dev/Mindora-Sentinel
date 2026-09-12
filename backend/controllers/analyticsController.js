import WellnessEntry from "../models/WellnessEntry.js";
import { calculateDistressTrend } from "../services/distressTrendService.js";

export const getWellnessAnalytics = async (req, res) => {
  try {
    const entries = await WellnessEntry.find({
      user: req.userId,
    }).sort({ date: 1 });

    if (entries.length === 0) {
      return res.status(200).json({
        message: "No wellness data available yet",
        entries: [],
      });
    }

    const total = entries.length;

    const averages = {
      mood:
        entries.reduce((sum, entry) => sum + entry.mood, 0) / total,

      energy:
        entries.reduce((sum, entry) => sum + entry.energy, 0) / total,

      sleep:
        entries.reduce((sum, entry) => sum + entry.sleep, 0) / total,

      stress:
        entries.reduce((sum, entry) => sum + entry.stress, 0) / total,

      anxiety:
        entries.reduce((sum, entry) => sum + entry.anxiety, 0) / total,
    };

    const trends = entries.map((entry) => ({
      date: entry.date,
      mood: entry.mood,
      energy: entry.energy,
      sleep: entry.sleep,
      stress: entry.stress,
      anxiety: entry.anxiety,
      emotion: entry.emotion,
      distressScore: entry.distressScore,
    }));

    const distressTrend = calculateDistressTrend(entries);

    const emotionCounts = {};

    entries.forEach((entry) => {
      if (entry.emotion) {
        emotionCounts[entry.emotion] =
          (emotionCounts[entry.emotion] || 0) + 1;
      }
    });

    res.status(200).json({
      totalEntries: total,
      averages,
      trends,
      emotionCounts,
      distressTrend,
    });
  } catch (error) {
    console.error("Wellness analytics error:", error.message);

    res.status(500).json({
      message: "Failed to fetch wellness analytics",
    });
  }
};