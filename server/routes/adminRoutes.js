const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check for 'admin' role
const checkAdminRole = (req, res, next) => {
    if (req.userData && req.userData.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied. Admin role required.' });
    }
};

// GET /api/admin/pending-facilities - Fetch all pending facilities
router.get('/pending-facilities', authMiddleware, checkAdminRole, adminController.getPendingFacilities);

// PUT /api/admin/facilities/:facilityId/status - Approve or reject a facility
router.put('/facilities/:facilityId/status', authMiddleware, checkAdminRole, adminController.updateFacilityStatus);

// GET /api/admin/users - Get a list of all users
router.get('/users', authMiddleware, checkAdminRole, adminController.getAllUsers);

// PUT /api/admin/users/:userId/status - Ban or unban a user
router.put('/users/:userId/status', authMiddleware, checkAdminRole, adminController.updateUserStatus);

router.get('/stats', authMiddleware, checkAdminRole, adminController.getDashboardStats);

module.exports = router;