import Feedback from "../models/feedbackModel.mjs";

// ✅ POST - create new feedback
export const createFeedback = async (req, res) => {
  try {
    const { name, email, feedback, suggestion } = req.body;

    if (!name || !email || !feedback) {
      return res.status(400).json({ message: "Name, Email aur Feedback are required" });
    }

    const newFeedback = new Feedback({
      name,
      email,
      feedback,
      suggestion,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback successfully submited", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ GET - fetch all feedback (for Admin Dashboard)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest pehle
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
