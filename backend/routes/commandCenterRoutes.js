import express from "express";
import {
  getCommandCenter,
  getCaseDetails,
} from "../controllers/commandCenterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("caseworker", "counsellor", "admin"),
  getCommandCenter
);

router.get(
  "/:caseId",
  protect,
  authorizeRoles("caseworker", "counsellor", "admin"),
  getCaseDetails
);

export default router;