import express from "express";
import { updateCaseLifecycle } from "../controllers/caseLifecycleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(
  protect,
  authorizeRoles("caseworker", "counsellor", "admin")
);

router.patch("/:caseId/status", updateCaseLifecycle);

export default router;