import mongoose from "mongoose";

const cbtJournalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    situation: {
      type: String,
      required: true,
      trim: true,
    },

    thought: {
      type: String,
      required: true,
      trim: true,
    },

    emotion: {
      type: String,
      required: true,
      trim: true,
    },

    evidence: {
      type: String,
      trim: true,
    },

    alternative: {
      type: String,
      trim: true,
    },

    reflection: {
      type: String,
      trim: true,
    },

    aiAnalysis: {
      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"],
      },

      emotions: {
        type: [String],
        default: [],
      },

      emotionalIntensity: {
        type: Number,
        min: 0,
        max: 100,
      },

      distressIndicators: {
        type: [String],
        default: [],
      },

      contextSignals: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const CBTJournal = mongoose.model(
  "CBTJournal",
  cbtJournalSchema
);

export default CBTJournal;