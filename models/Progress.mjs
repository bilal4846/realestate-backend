import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    weight: Number, // kg
    bodyFat: Number, // %
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      legs: Number
    },
    performance: {
      runTime: Number, // in minutes
      liftingWeight: Number // max lift in kg
    },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
