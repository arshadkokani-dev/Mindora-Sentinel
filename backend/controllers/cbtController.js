import CBTJournal from "../models/CBTJournal.js";
import { analyzeEmotion } from "../services/emotionAnalysisService.js";

export const createCBTJournal = async (req, res) => {
  try {
    const {
      situation,
      thought,
      emotion,
      evidence,
      alternative,
      reflection,
      date,
    } = req.body;

    // Save the journal first.
    // The journal should never depend on the AI service being available.
    const entry = await CBTJournal.create({
      user: req.userId,
      situation,
      thought,
      emotion,
      evidence,
      alternative,
      reflection,
      date,
    });

    // Combine the meaningful textual content for AI analysis.
    const textForAnalysis = [
      `Situation: ${situation || ""}`,
      `Thought: ${thought || ""}`,
      `Emotion: ${emotion || ""}`,
      `Evidence: ${evidence || ""}`,
      `Alternative perspective: ${alternative || ""}`,
      `Reflection: ${reflection || ""}`,
    ]
      .filter((text) => text.trim().length > 0)
      .join("\n");

    // AI analysis is an additional intelligence layer.
    // If Groq fails, the journal itself remains successfully saved.
    try {
      const aiAnalysis = await analyzeEmotion(textForAnalysis);

      entry.aiAnalysis = aiAnalysis;

      await entry.save();
    } catch (aiError) {
      console.error(
        "CBT journal AI analysis error:",
        aiError.message
      );
    }

    res.status(201).json({
      message: "CBT journal saved successfully",
      entry,
    });
  } catch (error) {
    console.error("Create CBT journal error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getCBTJournals = async (req, res) => {
  try {
    const entries = await CBTJournal.find({
      user: req.userId,
    }).sort({ date: -1 });

    res.status(200).json({
      entries,
    });
  } catch (error) {
    console.error("Get CBT journals error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};