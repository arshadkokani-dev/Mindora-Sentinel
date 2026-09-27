import { generateChatResponse } from "../services/chatbotService.js";
import { extractChatSignals } from "../services/chatSignalService.js";
import AIInteraction from "../models/AIInteraction.js";

export const chatWithMindora = async (req, res) => {
  try {
    const { message, context, language, channel = "web" } = req.body;

    const allowedChannels = [
      "web",
      "mobile",
      "sms",
      "ivrs",
      "helpline",
      "helpline_14566",
    ];

    if (!allowedChannels.includes(channel)) {
      return res.status(400).json({
        message: "Invalid communication channel.",
      });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "A valid message is required.",
      });
    }

    const reply = await generateChatResponse(message, context, language);
    const signals = await extractChatSignals(message, context);

    await AIInteraction.create({
      user: req.userId,
      source: channel,
      signals,
    });
    if (!reply) {
      return res.status(502).json({
        message: "The AI service returned an empty response.",
      });
    }

    res.status(200).json({
      reply,
      signals,
      channel,
      language,
    });
  } catch (error) {
    console.error("Chatbot error:", error.message);

    res.status(500).json({
      message: "Unable to process the AI response.",
    });
  }
};