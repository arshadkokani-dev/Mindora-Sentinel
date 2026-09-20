import express from "express";

import {
  getAlerts,
  acknowledgeAlert,
  reviewAlert,
  resolveAlert,
} from "../controllers/alertController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(
  protect,
  authorizeRoles("caseworker", "counsellor", "admin")
);

router.get("/", getAlerts);

router.patch(
  "/:alertId/acknowledge",
  acknowledgeAlert
);

router.patch(
  "/:alertId/review",
  reviewAlert
);

router.patch(
  "/:alertId/resolve",
  resolveAlert
);

export default router;