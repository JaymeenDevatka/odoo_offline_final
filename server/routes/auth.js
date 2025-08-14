const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// Authentication routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtpAndRegister);
router.post('/login', authController.login);

// Profile routes
router.get('/profile', authenticate, authController.getProfile);
router.get('/profile/:userId', authenticate, authController.getProfile);
router.put(
  '/profile', 
  authenticate, 
  upload.single('avatar'), 
  authController.updateProfile
);

// Admin routes
router.get('/users', authenticate,authController.getAllUsers);

module.exports = router;