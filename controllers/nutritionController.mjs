import Nutrition from "../models/Nutrition.mjs";

// Helper function to normalize date to PKT (UTC+5)
const normalizeToPKT = (date) => {
  const inputDate = new Date(date);
  // Adjust for PKT (UTC+5)
  const pktOffset = 5 * 60; // PKT offset in minutes
  const localDate = new Date(inputDate.getTime() + pktOffset * 60 * 1000);
  // Set to start of day in PKT
  return new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
};

// CREATE
export const createNutrition = async (req, res) => {
  try {
    const { date, mealType, items, notes } = req.body;

    if (!mealType || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "mealType aur kam az kam 1 item required hai" });
    }

    const normalizedDate = date ? normalizeToPKT(date) : normalizeToPKT(new Date());

    const doc = new Nutrition({
      user: req.user._id,
      date: normalizedDate,
      mealType,
      items,
      notes
    });

    doc.recomputeTotals();
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (list with filters)
export const getNutritions = async (req, res) => {
  try {
    const { date, from, to, mealType, q } = req.query;

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

    if (mealType) filter.mealType = mealType;

    // Search by item name
    if (q) {
      filter.items = { $elemMatch: { name: { $regex: q, $options: "i" } } };
    }

    const nutritions = await Nutrition.find(filter)
      .sort({ date: -1, createdAt: -1 });

    res.json(nutritions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (single)
export const getNutritionById = async (req, res) => {
  try {
    const doc = await Nutrition.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: "Nutrition entry nahi mili" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateNutrition = async (req, res) => {
  try {
    const doc = await Nutrition.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: "Nutrition entry nahi mili" });

    const { date, mealType, items, notes } = req.body;

    if (date !== undefined) doc.date = normalizeToPKT(date);
    if (mealType !== undefined) doc.mealType = mealType;
    if (notes !== undefined) doc.notes = notes;
    if (Array.isArray(items)) doc.items = items;

    doc.recomputeTotals();
    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteNutrition = async (req, res) => {
  try {
    const doc = await Nutrition.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: "Nutrition entry nahi mili" });
    res.json({ message: "Nutrition entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};