import mongoose from 'mongoose';
import User from './models/User.mjs';

async function revertMigration() {
  try {
    console.log("Starting revert migration...");
    await mongoose.connect('mongodb://localhost:27017/fitness-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    const users = await User.find({
      $or: [
        { age: { $exists: true } },
        { goalWeight: { $exists: true } }
      ]
    });
    console.log(`Found ${users.length} users with age or goalWeight:`, users.map(u => u.email));

    for (const user of users) {
      console.log(`Processing user: ${user.email}`);
      if (user.age !== undefined) {
        delete user.age;
        console.log(`Removed age for ${user.email}`);
      }
      if (user.goalWeight !== undefined) {
        delete user.goalWeight;
        console.log(`Removed goalWeight for ${user.email}`);
      }
      await user.save();
      console.log(`Saved user: ${user.email}`);
    }
    console.log(`Reverted ${users.length} users`);
  } catch (error) {
    console.error('Revert migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

revertMigration();