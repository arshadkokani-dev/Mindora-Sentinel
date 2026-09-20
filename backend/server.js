import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import "./models/User.js";
import "./models/WellnessEntry.js";
import authRoutes from "./routes/authRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import cbtRoutes from "./routes/cbtRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import commandCenterRoutes from "./routes/commandCenterRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import interventionRoutes from "./routes/interventionRoutes.js";
import caseLifecycleRoutes from "./routes/caseLifecycleRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/cbt", cbtRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/cases", commandCenterRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/interventions", interventionRoutes);
app.use("/api/case-lifecycle", caseLifecycleRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Mental Wellness Tracker API is running");
});

mongoose
  .connect(process.env.MONGO_URI,
    {
        serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
    })
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });