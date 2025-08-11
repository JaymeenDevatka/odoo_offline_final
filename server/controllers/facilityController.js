const { Facility } = require('../models'); // Import from the central models/index.js

// This function creates a new facility and links it to the logged-in owner
exports.createFacility = async (req, res) => {
    try {
        // req.userData is added by our authMiddleware
        const ownerId = req.userData.userId; 

        const { name, description, address } = req.body;

        const newFacility = await Facility.create({
            name,
            description,
            address,
            ownerId: ownerId, // Link the facility to the user who created it
            status: 'pending' // All new facilities must be approved by an admin
        });

        res.status(201).json({
            message: 'Facility created successfully! It is pending admin approval.',
            facility: newFacility
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create facility.', error: error.message });
    }
};