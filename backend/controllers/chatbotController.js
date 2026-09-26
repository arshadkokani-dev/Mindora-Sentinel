import { generateChatResponse } from "../services/chatbotService.js";
import { extractChatSignals } from "../services/chatSignalService.js";

export const chatWithMindora = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "A valid message is required.",
      });
    }

    const reply = await generateChatResponse(message, context);
    const signals = await extractChatSignals(message, context);
    if (!reply) {
      return res.status(502).json({
        message: "The AI service returned an empty response.",
      });
    }

    res.status(200).json({
      reply,
      signals,
    });
  } catch (error) {
    console.error("Chatbot error:", error.message);

    res.status(500).json({
      message: "Unable to process the AI response.",
    });
  }
};