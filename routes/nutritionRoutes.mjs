import express from "express";
import {
  createNutrition,
  getNutritions,
  getNutritionById,
  updateNutrition,
  deleteNutrition
} from "../controllers/nutritionController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.route("/")
  .post(protect, createNutrition)
  .get(protect, getNutritions);

router.route("/:id")
  .get(protect, getNutritionById)
  .put(protect, updateNutrition)
  .delete(protect, deleteNutrition);

export default router;
