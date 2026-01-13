import mongoose from 'mongoose';
import User from "../models/User.mjs";


async function migrateUsers() {
  try {
    console.log("Starting migration...");
    await mongoose.connect('mongodb://127.0.0.1:27017/fitness-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    const users = await User.find({
      $or: [
        { age: { $exists: false } },
        { goalWeight: { $exists: false } }
      ]
    });
    console.log(`Found ${users.length} users to migrate:`, users.map(u => u.email));

    for (const user of users) {
      console.log(`Processing user: ${user.email}`);
      if (!user.hasOwnProperty('age')) {
        user.age = null;
        console.log(`Set age to null for ${user.email}`);
      }
      if (!user.hasOwnProperty('goalWeight')) {
        user.goalWeight = null;
        console.log(`Set goalWeight to null for ${user.email}`);
      }
      await user.save();
      console.log(`Saved user: ${user.email}`);
    }
    console.log(`Migrated ${users.length} users`);
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateUsers();