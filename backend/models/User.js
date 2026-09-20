import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["victim", "caseworker", "counsellor", "admin"],
      default: "victim",
    },
    caseStatus: {
      type: String,
      enum: [
        "Open",
        "Under Review",
        "Active Support",
        "Resolved",
        "Closed",
      ],
      default: "Open",
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;