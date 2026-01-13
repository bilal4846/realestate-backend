import express from "express";
import { createFeedback, getAllFeedback } from "../controllers/feedbackController.mjs";


const router = express.Router();

// User form submit karega
router.post("/", createFeedback);

// Admin Dashboard mai feedback fetch hoga
router.get("/", getAllFeedback);

export default router;
