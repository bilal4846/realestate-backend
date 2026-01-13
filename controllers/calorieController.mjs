export const calculateCalories = (req, res) => {
  const { gender, age, height, weight, activityLevel, unitSystem = 'metric' } = req.body;

  // Strict validation
  if (!gender || !age || !height || !weight || !activityLevel) {
    return res.status(400).json({ error: 'All fields are required: gender, age, height, weight, activityLevel' });
  }

  const cleanGender = gender.toLowerCase();
  if (!['male', 'female'].includes(cleanGender)) {
    return res.status(400).json({ error: 'Invalid gender: must be "male" or "female"' });
  }

  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
    return res.status(400).json({ error: 'Invalid age: must be between 18 and 100' });
  }

  const parsedHeight = parseFloat(height);
  const parsedWeight = parseFloat(weight);
  if (isNaN(parsedHeight) || isNaN(parsedWeight)) {
    return res.status(400).json({ error: 'Height and weight must be numbers' });
  }

  const cleanActivityLevel = activityLevel.toLowerCase();
  const cleanUnitSystem = unitSystem.toLowerCase();

  if (!['metric', 'imperial'].includes(cleanUnitSystem)) {
    return res.status(400).json({ error: 'Invalid unitSystem: must be "metric" or "imperial"' });
  }

  // Unit-specific validation and conversion
  let metricHeight, metricWeight;
  if (cleanUnitSystem === 'metric') {
    if (parsedHeight < 100 || parsedHeight > 250) {
      return res.status(400).json({ error: 'Invalid height for metric: must be between 100 and 250 cm' });
    }
    if (parsedWeight < 30 || parsedWeight > 300) {
      return res.status(400).json({ error: 'Invalid weight for metric: must be between 30 and 300 kg' });
    }
    metricHeight = parsedHeight;
    metricWeight = parsedWeight;
  } else { // imperial
    if (parsedHeight < 39 || parsedHeight > 98) {
      return res.status(400).json({ error: 'Invalid height for imperial: must be between 39 and 98 inches' });
    }
    if (parsedWeight < 66 || parsedWeight > 661) {
      return res.status(400).json({ error: 'Invalid weight for imperial: must be between 66 and 661 pounds' });
    }
    metricHeight = parsedHeight * 2.54; // inches to cm
    metricWeight = parsedWeight / 2.20462; // lbs to kg
  }

  const activityMultipliers = {
    bmr: 1.0, // No activity, just base metabolic rate
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Exercise 1-3 times/week
    moderate: 1.47, // Exercise 4-5 times/week
    active: 1.55, // Daily exercise or intense exercise 3-4 times/week
    'very active': 1.725, // Intense exercise 6-7 times/week
    'extra active': 1.9 // Very intense exercise daily or physical job
  };

  if (!activityMultipliers[cleanActivityLevel]) {
    return res.status(400).json({ error: 'Invalid activityLevel: must be "bmr", "sedentary", "light", "moderate", "active", "very active", or "extra active"' });
  }

  // Calculate BMR using Mifflin-St Jeor
  let bmr;
  if (cleanGender === 'male') {
    bmr = 10 * metricWeight + 6.25 * metricHeight - 5 * parsedAge + 5;
  } else {
    bmr = 10 * metricWeight + 6.25 * metricHeight - 5 * parsedAge - 161;
  }

  // Calculate TDEE
  const multiplier = activityMultipliers[cleanActivityLevel];
  const tdee = bmr * multiplier;

  // Calculate results with deficits
  const maintenance = Math.round(tdee);
  const mildWeightLoss = Math.round(tdee - 250);
  const weightLoss = Math.round(tdee - 500);
  const extremeWeightLoss = Math.round(tdee - 1000);

  // Calculate percentages
  const results = {
    maintenance: {
      calories: maintenance,
      percentage: '100%',
      description: 'Maintain weight'
    },
    mildWeightLoss: {
      calories: mildWeightLoss,
      percentage: `${Math.round((mildWeightLoss / maintenance) * 100)}%`,
      description: 'Mild weight loss (0.25 kg/week)'
    },
    weightLoss: {
      calories: weightLoss,
      percentage: `${Math.round((weightLoss / maintenance) * 100)}%`,
      description: 'Weight loss (0.5 kg/week)'
    },
    extremeWeightLoss: {
      calories: extremeWeightLoss,
      percentage: `${Math.round((extremeWeightLoss / maintenance) * 100)}%`,
      description: 'Extreme weight loss (1 kg/week)'
    }
  };

  res.status(200).json({ results, formula: 'mifflin-st-jeor' });
};