// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import User from './models/User.mjs';

// async function fixPasswords() {
//   try {
//     console.log("Starting password fix...");
//     await mongoose.connect('mongodb://localhost:27017/fitness-tracker', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log("Connected to MongoDB");

//     const users = await User.find();
//     console.log(`Found ${users.length} users`);

//     for (const user of users) {
//       console.log(`Checking user: ${user.email}`);
//       // Test if password is double-hashed by trying to login with known password
//       const isValid = await bcrypt.compare('password123', user.password); // Replace with actual password
//       if (!isValid) {
//         console.log(`Fixing password for ${user.email}`);
//         // Assuming you know the plain password (e.g., from testing)
//         const plainPassword = 'password123'; // Replace with actual password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(plainPassword, salt);
//         await user.save();
//         console.log(`Fixed password for ${user.email}`);
//       } else {
//         console.log(`Password OK for ${user.email}`);
//       }
//     }
//     console.log("Password fix completed");
//   } catch (error) {
//     console.error('Password fix error:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB");
//   }
// }

// fixPasswords();