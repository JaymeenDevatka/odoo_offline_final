const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET /api/admin/pending-facilities - Fetch all pending facilities
router.get(
  "/pending-facilities",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getPendingFacilities
);

// PUT /api/admin/facilities/:facilityId/status - Approve or reject a facility
router.put(
  "/facilities/:facilityId/status",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.updateFacilityStatus
);

// GET /api/admin/users - Get a list of all users
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getAllUsers
);

// PUT /api/admin/users/:userId/status - Ban or unban a user
router.put(
  "/users/:userId/status",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.updateUserStatus
);

router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getDashboardStats
);

module.exports = router;
