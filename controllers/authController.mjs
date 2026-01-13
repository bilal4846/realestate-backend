import bcrypt from "bcryptjs";
import mongoose from "mongoose"; // Added for isValidObjectId
import User from "../models/User.mjs";
import generateToken from "../utils/generateToken.mjs";
import Feedback from "../models/feedbackModel.mjs";

// Get All Users
export let getAllUsers = async (req, res) => {
  let users = await User.find();
  if (users.length == 0) {
    return res.status(404).json({ message: 'No users found' });
  }
  return res.status(200).json({ message: 'Showing our users', users });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password }); // Let pre-save hook handle hashing

  if (user) {
    return res.status(201).json({
      message: "Registration successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role
    });
  }
  return res.status(400).json({ message: "Invalid user data" });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User does not exist. Please register first." });
  }
  if (await user.matchPassword(password)) {
    return res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role
      token: generateToken(user._id, user.role), // Pass role to token
    });
  }
  return res.status(401).json({ message: "Invalid email or password" });
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
    if (name) user.name = name;

    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New: Update User Role (moved from routes)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate ObjectID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    console.error('Role update error:', error); // Log detailed error
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Delete User (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent admin from deleting their own account
    if (id === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated feedback
    await Feedback.deleteMany({ email: user.email });

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};