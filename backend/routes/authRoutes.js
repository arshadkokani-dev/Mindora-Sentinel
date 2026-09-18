import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, async (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.userId,
    role: req.userRole,
  });
});

export default router;