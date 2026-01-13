import Workout from "../models/Workout.mjs";

// Helper function to normalize date to PKT (UTC+5)
const normalizeToPKT = (date) => {
  const inputDate = new Date(date);
  const pktOffset = 5 * 60; // PKT offset in minutes
  const localDate = new Date(inputDate.getTime() + pktOffset * 60 * 1000);
  return new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
};

// Create workout
export const createWorkout = async (req, res) => {
  try {
    const { date, name, category, sets, reps, weight, notes } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const normalizedDate = date ? normalizeToPKT(date) : normalizeToPKT(new Date());

    const workout = await Workout.create({
      user: req.user._id,
      date: normalizedDate,
      name,
      category,
      sets,
      reps,
      weight,
      notes
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all workouts for logged-in user
export const getWorkouts = async (req, res) => {
  try {
    const { date, from, to } = req.query;

    const filter = { user: req.user._id };

    // Single date OR range filter, normalized to PKT
    if (date) {
      const d = normalizeToPKT(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    } else if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = normalizeToPKT(from);
      if (to) {
        const t = normalizeToPKT(to);
        t.setDate(t.getDate() + 1);
        filter.date.$lt = t;
      }
    }

    const workouts = await Workout.find(filter)
      .sort({ date: -1, createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single workout
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update workout
export const updateWorkout = async (req, res) => {
  try {
    const { date, name, category, sets, reps, weight, notes } = req.body;

    const updateData = { name, category, sets, reps, weight, notes };
    if (date !== undefined) updateData.date = normalizeToPKT(date);

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete workout
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};