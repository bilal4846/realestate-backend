import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import workoutRoutes from "./routes/workoutRoutes.mjs";
import nutritionRoutes from "./routes/nutritionRoutes.mjs";
import progressRoutes from "./routes/progressRoutes.mjs";
import feedbackRoutes from "./routes/feedbackRoutes.mjs";
import calorieRoutes from './routes/calorieRoutes.mjs';
// import  DashboardRoutes  from "./controllers/dashboardController.mjs";
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api', calorieRoutes);
// app.use("/api/dashboard", DashboardRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));