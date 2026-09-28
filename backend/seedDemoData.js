// Synthetic demo data generator for local/SIH demonstration.
// Do not use these credentials or patterns for production users.import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import WellnessEntry from "./models/WellnessEntry.js";
import { calculateDistressScore } from "./services/distressScoreService.js";

dotenv.config();

const PASSWORD = "Demo@123";

const demoCases = [
  {
    name: "Ali",
    email: "ali.low@mindora.test",
    pattern: [
      9, 9, 8, 9, 8,
      9, 8, 9, 10, 8,
      9, 8, 9, 10, 9,
    ],
  },

  {
    name: "Ria",
    email: "ria.mod@mindora.test",
    pattern: [
      6, 6, 7, 6, 5,
      6, 7, 6, 5, 6,
      7, 6, 6, 5, 6,
    ],
  },

  {
    name: "Dev",
    email: "dev.imp@mindora.test",
    pattern: [
      3, 3, 4, 4, 5,
      5, 6, 6, 7, 7,
      8, 8, 9, 9, 9,
    ],
  },

  {
    name: "Ava",
    email: "ava.esc@mindora.test",
    pattern: [
      9, 9, 8, 8, 7,
      7, 6, 6, 5, 5,
      4, 4, 3, 2, 2,
    ],
  },

  {
    name: "Raj",
    email: "raj.crit@mindora.test",
    pattern: [
      2, 2, 2, 3, 2,
      2, 3, 2, 2, 3,
      2, 2, 2, 2, 2,
    ],
  },

  {
    name: "Leo",
    email: "leo.mix@mindora.test",
    pattern: [
      7, 4, 6, 5, 8,
      3, 6, 4, 7, 5,
      3, 6, 4, 7, 5,
    ],
  },
];

const buildWellnessValues = (base) => {
  const positiveValue = Math.min(10, Math.max(1, base));

  const distressValue = Math.min(
    10,
    Math.max(1, 11 - base)
  );

  return {
    mood: positiveValue,
    energy: positiveValue,
    sleep: positiveValue,
    stress: distressValue,
    anxiety: distressValue,
  };
};

const getEmotion = (distressScore) => {
  if (distressScore < 25) {
    return "Calm";
  }

  if (distressScore < 50) {
    return "Concerned";
  }

  if (distressScore < 75) {
    return "Distressed";
  }

  return "Highly Distressed";
};

const getText = (distressScore) => {
  if (distressScore < 25) {
    return {
      gratitude: "Had some positive moments today.",
      highlight: "Completed daily activities.",
      journal: "Overall feeling relatively balanced today.",
    };
  }

  if (distressScore < 50) {
    return {
      gratitude: "Had a few positive moments today.",
      highlight: "Managed most daily activities.",
      journal: "Some parts of today felt challenging.",
    };
  }

  if (distressScore < 75) {
    return {
      gratitude: "Trying to focus on the positive parts of today.",
      highlight: "Managed to complete some daily activities.",
      journal: "Today felt more difficult than usual.",
    };
  }

  return {
    gratitude: "Trying to find something positive today.",
    highlight: "Some daily activities felt difficult.",
    journal: "Today felt significantly challenging.",
  };
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected.");

    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    const STAFF_EMAIL = "worker@mindora.test";
    const STAFF_PASSWORD = "Work@123";

    const existingStaff = await User.findOne({
    email: STAFF_EMAIL,
    });

    if (existingStaff) {
    await User.deleteOne({
        _id: existingStaff._id,
    });
    }

    const hashedStaffPassword = await bcrypt.hash(
    STAFF_PASSWORD,
    10
    );

    await User.create({
    name: "Demo Caseworker",
    email: STAFF_EMAIL,
    password: hashedStaffPassword,
    role: "caseworker",
    district: "Pune",
    state: "Maharashtra",
    country: "India",
    jurisdictionLevel: "district",
    caseStatus: "Open",
    });

    console.log("Created Demo Caseworker.");

    for (const demoCase of demoCases) {
      console.log(`\nProcessing ${demoCase.name}...`);

      // Remove only this demo user's previous data.
      const existingUser = await User.findOne({
        email: demoCase.email,
      });

      if (existingUser) {
        await WellnessEntry.deleteMany({
          user: existingUser._id,
        });

        await User.deleteOne({
          _id: existingUser._id,
        });

        console.log("Removed previous demo data.");
      }

      // Create demo victim account.
      const user = await User.create({
        name: demoCase.name,
        email: demoCase.email,
        password: hashedPassword,
        role: "victim",
        district: "Pune",
        state: "Maharashtra",
        country: "India",
        jurisdictionLevel: "district",
        caseStatus: "Open",
      });

      const entries = [];

      for (let i = 0; i < demoCase.pattern.length; i++) {
        const base = demoCase.pattern[i];

        const values = buildWellnessValues(base);

        // Use the ACTUAL Mindora-Sentinel distress algorithm.
        const { distressScore, riskLevel } =
          calculateDistressScore(values);

        const text = getText(distressScore);

        // Create 15 chronological dates.
        const date = new Date();

        date.setDate(
          date.getDate() - (14 - i)
        );

        date.setHours(10, 0, 0, 0);

        entries.push({
          user: user._id,

          date,

          ...values,

          gratitude: text.gratitude,

          highlight: text.highlight,

          journal: text.journal,

          emotion: getEmotion(distressScore),

          distressScore,

          riskLevel,
        });

        console.log(
          `  Day ${i + 1}: Score ${distressScore} | ${riskLevel}`
        );
      }

      await WellnessEntry.insertMany(entries);

      console.log(
        `Created ${demoCase.name}: ${entries.length} wellness entries`
      );
    }

    console.log("\n======================================");
    console.log("DEMO DATA CREATION COMPLETE");
    console.log("======================================");
    console.log("6 demo users created.");
    console.log("90 wellness entries created.");
    console.log(`Password for all demo users: ${PASSWORD}`);
    console.log("======================================\n");
  } catch (error) {
    console.error("\nDemo data seeding failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

run();