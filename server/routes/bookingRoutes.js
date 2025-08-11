const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/bookings - Create a new booking (requires login)
router.post('/', authMiddleware, bookingController.createBooking);

// GET /api/bookings/my-bookings - Get the current user's bookings (requires login)
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);

module.exports = router;