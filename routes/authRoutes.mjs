// authRoutes.mjs
import express from 'express';
import { registerUser, loginUser, getAllUsers, updateProfile, updateUserRole, deleteUser } from '../controllers/authController.mjs';
import { protect, restrictTo } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, (req, res) => { // Simplified, no inline try-catch needed if controller handles
  res.status(200).json({ msg: "User profile", user: req.user });
});
router.put('/profile', protect, updateProfile);
router.put('/users/:id/role', protect, restrictTo('admin'), updateUserRole); // Just the route, logic in controller


// Admin routes for editing and deleting users

router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);
export default router;