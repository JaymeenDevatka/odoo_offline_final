const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/reviews/:facilityId - Add a review to a facility
router.post('/:facilityId', authMiddleware, reviewController.addReview);

module.exports = router;