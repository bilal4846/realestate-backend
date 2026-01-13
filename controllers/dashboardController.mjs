 
 


// import User from '../models/userModel.js';
// import Progress from '../models/progressModel.js';
// import Workout from '../models/workoutModel.js';
// import Nutrition from '../models/nutritionModel.js';
 
//  export const Dashboard= async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('name age currentWeight goalWeight initialWeight');
//     const progress = await Progress.find({ user: req.user._id }).select('date weight');
//     const workouts = await Workout.find({ user: req.user._id }).select('categories recentCount');
//     const nutrition = await Nutrition.findOne({ user: req.user._id }).select('macros dailyCalories calorieGoal');

//     res.status(200).json({
//       user,
//       progress,
//       workouts,
//       nutrition,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// }