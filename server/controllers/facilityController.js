// controllers/facilityController.js

const { Facility } = require('../models'); // Import Facility model from central models/index.js

/**
 * Create a new facility and link it to the logged-in owner
 */
exports.createFacility = async (req, res) => {
    try {
        // req.userData is set by authMiddleware after verifying JWT
        const ownerId = req.userData.userId;

        const { name, description, address } = req.body;

        // Create a new facility
        const newFacility = await Facility.create({
            name,
            description,
            address,
            ownerId,        // Link facility to creator
            status: 'pending' // Pending approval by admin
        });

        return res.status(201).json({
            message: 'Facility created successfully! It is pending admin approval.',
            facility: newFacility
        });

    } catch (error) {
        console.error('Error creating facility:', error);
        return res.status(500).json({
            message: 'Failed to create facility.',
            error: error.message
        });
    }
};
