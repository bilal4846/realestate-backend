import express from "express";
import {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress
} from "../controllers/progressController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/", protect, createProgress);
router.get("/", protect, getProgress);
router.get("/:id", protect, getProgressById);
router.put("/:id", protect, updateProgress);
router.delete("/:id", protect, deleteProgress);

export default router;
