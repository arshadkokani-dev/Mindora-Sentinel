import mongoose from "mongoose";

const aiInteractionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    source: {
      type: String,
      enum: ["chatbot"],
      default: "chatbot",
    },

    signals: {
      sentiment: {
        type: String,
        default: "Unknown",
        trim: true,
      },

      emotions: {
        type: [String],
        default: [],
      },

      distressSignals: {
        type: [String],
        default: [],
      },

      urgency: {
        type: String,
        default: "Unknown",
        trim: true,
      },

      relevantSignals: {
        type: [String],
        default: [],
      },

      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0,
      },

      reasoning: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const AIInteraction = mongoose.model(
  "AIInteraction",
  aiInteractionSchema
);

export default AIInteraction;