import express from "express";

import { getAuditLogs } from "../controllers/auditController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(
  protect,
  authorizeRoles("caseworker", "counsellor", "admin")
);

router.get("/", getAuditLogs);

export default router;