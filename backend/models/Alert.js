import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["Moderate", "High", "Critical"],
      required: true,
    },

    reasons: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Acknowledged",
        "Under Review",
        "Resolved",
      ],
      default: "Active",
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    reviewStartedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    actionNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Alert", alertSchema);