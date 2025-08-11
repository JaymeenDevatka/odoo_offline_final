const express = require('express');
const router = express.Router();

const facilityController = require('../controllers/facilityController');
const authMiddleware = require('../middleware/authMiddleware');

// Custom middleware to check if the user has the 'owner' role
const checkOwnerRole = (req, res, next) => {
    if (req.userData && req.userData.role === 'owner') {
        next(); // If user is an owner, proceed to the next function
    } else {
        res.status(403).json({ message: 'Access denied. Only facility owners can perform this action.' });
    }
};

// Route to create a new facility
// POST /api/facilities
// This route is protected by two middleware functions
router.post('/', authMiddleware, checkOwnerRole, facilityController.createFacility);

module.exports = router;