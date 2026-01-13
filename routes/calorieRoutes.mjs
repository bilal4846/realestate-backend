import express from 'express';
import { calculateCalories } from '../controllers/calorieController.mjs';

const router = express.Router();

router.post('/calorie-calculator', calculateCalories);

export default router;