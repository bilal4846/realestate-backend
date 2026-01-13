import Progress from "../models/Progress.mjs";

// ➤ Create progress
export const createProgress = async (req, res) => {
  try {
    const progress = new Progress({ ...req.body, user: req.user._id });
    const saved = await progress.save();
    res.status(201).json({msg:"progress created",saved});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ➤ Get all progress (with optional date range filter)
export const getProgress = async (req, res) => {
  console.log("Progress API Hit!");

  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id }; // Make sure req.user is set via auth middleware
console.log("User in request:", req.user);

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const data = await Progress.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Error in getProgress:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ➤ Get single progress by ID
export const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!progress) return res.status(404).json({ message: "Not found" });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Update progress
export const updateProgress = async (req, res) => {
  try {
    const updated = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Delete progress
export const deleteProgress = async (req, res) => {
  try {
    const deleted = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
