import express from "express";
import { chatWithMindora } from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", chatWithMindora);

export default router;