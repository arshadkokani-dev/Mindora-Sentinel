import mongoose from "mongoose";

const wellnessEntrySchema = new mongoose.Schema(
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

    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    sleep: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    stress: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    anxiety: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    gratitude: {
      type: String,
      trim: true,
    },

    highlight: {
      type: String,
      trim: true,
    },

    journal: {
      type: String,
      trim: true,
    },

    emotion: {
      type: String,
      trim: true,
    },

    distressScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High", "Critical"],
    },
  },
  {
    timestamps: true,
  }
);

const WellnessEntry = mongoose.model(
  "WellnessEntry",
  wellnessEntrySchema
);

export default WellnessEntry;