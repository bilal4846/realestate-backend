import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },          // e.g. "Boiled Egg"
  quantity: { type: Number, required: true, min: 0 },           // e.g. 2
  unit: { type: String, default: "serving" },                   // e.g. "pcs", "g", "ml"
  calories: { type: Number, required: true, min: 0 },           // per quantity entered
  protein: { type: Number, default: 0, min: 0 },                // grams
  carbs:   { type: Number, default: 0, min: 0 },                // grams
  fat:     { type: Number, default: 0, min: 0 },                // grams
}, { _id: false });

const nutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: () => new Date() },              // meal date
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snacks"],
    required: true
  },
  items: { type: [itemSchema], validate: v => Array.isArray(v) && v.length > 0 },
  notes: { type: String, trim: true },

  // auto totals
  totalCalories: { type: Number, default: 0 },
  totalProtein:  { type: Number, default: 0 },
  totalCarbs:    { type: Number, default: 0 },
  totalFat:      { type: Number, default: 0 },
}, { timestamps: true });

// Recompute totals helper (use in create/update)
nutritionSchema.methods.recomputeTotals = function () {
  const totals = this.items.reduce((acc, it) => {
    acc.cal += (Number(it.calories) || 0);
    acc.p   += (Number(it.protein)  || 0);
    acc.c   += (Number(it.carbs)    || 0);
    acc.f   += (Number(it.fat)      || 0);
    return acc;
  }, { cal: 0, p: 0, c: 0, f: 0 });

  this.totalCalories = Number(totals.cal.toFixed(2));
  this.totalProtein  = Number(totals.p.toFixed(2));
  this.totalCarbs    = Number(totals.c.toFixed(2));
  this.totalFat      = Number(totals.f.toFixed(2));
};

export default mongoose.model("Nutrition", nutritionSchema);
