import mongoose from "mongoose";

const interventionSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Counselling",
        "Medical Support",
        "Witness Protection",
        "Relocation",
        "Financial Assistance",
        "Legal Aid",
        "Rehabilitation",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed", "Cancelled"],
      default: "Assigned",
    },

    priority: {
      type: String,
      enum: ["Low", "Moderate", "High", "Critical"],
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    actionNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Intervention", interventionSchema);