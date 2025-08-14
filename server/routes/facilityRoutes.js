// routes/facilityRoutes.js

const express = require("express");
const router = express.Router();

const facilityController = require("../controllers/facilityController"); // ✅ Correct import
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Route: Create a new facility
// Method: POST
// URL: /api/facilities
// Middlewares: authMiddleware (checks JWT) + authorizeRoles("owner")
router.post(
    "/",
    authMiddleware,
    authorizeRoles("owner"),
    facilityController.createFacility
);

module.exports = router;
