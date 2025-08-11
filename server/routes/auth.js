const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for POST /api/auth/register
router.post('/register', authController.register);

// (Add your login route here later)

router.post('/verify-otp', authController.verifyOtpAndRegister);

router.post('/login', authController.login);
// router.post('/login', authController.login);

module.exports = router;