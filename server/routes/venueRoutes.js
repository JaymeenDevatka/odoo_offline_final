const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// GET /api/venues - A public route to get all approved venues
router.get('/', venueController.getApprovedVenues);

// GET /api/venues/popular - A public route for featured venues
router.get('/popular', venueController.getPopularVenues);

// GET /api/venues/:id - A public route for a single venue's details
router.get('/:id', venueController.getVenueById);

module.exports = router;