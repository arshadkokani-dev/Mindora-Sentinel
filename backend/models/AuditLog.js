import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actorRole: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    details: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AuditLog", auditLogSchema);