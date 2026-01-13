import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    suggestion: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // isse createdAt aur updatedAt auto save hoga
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
