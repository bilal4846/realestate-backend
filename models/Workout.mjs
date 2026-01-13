import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
   date: { type: Date, required: true, default: () => new Date() }, // Added date field
  name: { type: String, required: true }, // e.g. "Bench Press"
  category: { type: String, enum: ["strength", "cardio", "flexibility"], required: true },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number }, // in kg
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Workout", workoutSchema);
