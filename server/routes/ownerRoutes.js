const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check for 'owner' role
const checkOwnerRole = (req, res, next) => {
    if (req.userData && req.userData.role === 'owner') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied. Owner role required.' });
    }
};

// GET /api/owner/dashboard - Get all data for the owner dashboard
router.get('/dashboard', authMiddleware, checkOwnerRole, ownerController.getOwnerDashboard);

// GET /api/owner/chart-data - Get data for dashboard charts
router.get('/chart-data', authMiddleware, checkOwnerRole, ownerController.getChartData);

// POST /api/owner/courts - Add a new court
router.post('/courts', authMiddleware, checkOwnerRole, ownerController.addCourt);

// PUT /api/owner/courts/:courtId - Update a court
router.put('/courts/:courtId', authMiddleware, checkOwnerRole, ownerController.updateCourt);

// DELETE /api/owner/courts/:courtId - Delete a court
router.delete('/courts/:courtId', authMiddleware, checkOwnerRole, ownerController.deleteCourt);

// GET /api/owner/my-facility - Get facility details for editing
router.get('/my-facility', authMiddleware, checkOwnerRole, ownerController.getMyFacility);

// PUT /api/owner/my-facility - Update facility details
router.put('/my-facility', authMiddleware, checkOwnerRole, ownerController.updateMyFacility);

// POST /api/owner/my-facility/photos - Add a photo
router.post('/my-facility/photos', authMiddleware, checkOwnerRole, ownerController.addFacilityPhoto);


module.exports = router;