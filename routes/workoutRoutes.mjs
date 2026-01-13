import express from "express";
import { createWorkout, getWorkouts, getWorkoutById, updateWorkout, deleteWorkout } from "../controllers/workoutController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// All routes protected
router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);
router.get("/:id", protect, getWorkoutById);
router.put("/:id", protect, updateWorkout);
router.delete("/:id", protect, deleteWorkout);

export default router;
