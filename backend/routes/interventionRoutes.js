import express from "express";
import {
  getInterventions,
  createCaseIntervention,
  updateCaseIntervention,
} from "../controllers/interventionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(
  protect,
  authorizeRoles("caseworker", "counsellor", "admin")
);

router.get("/", getInterventions);

router.post("/", createCaseIntervention);

router.patch("/:interventionId", updateCaseIntervention);

export default router;