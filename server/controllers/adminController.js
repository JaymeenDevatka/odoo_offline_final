const { Facility, User } = require('../models');

// Fetches all facilities that are awaiting approval
exports.getPendingFacilities = async (req, res) => {
    try {
        const pendingFacilities = await Facility.findAll({
            where: { status: 'pending' },
            // Include owner's info to display on the admin page
            include: [{
                model: User,
                as: 'Owner',
                attributes: ['fullName', 'email']
            }]
        });
        res.status(200).json(pendingFacilities);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch pending facilities.', error: error.message });
    }
};

// Updates a facility's status to 'approved' or 'rejected'
exports.updateFacilityStatus = async (req, res) => {
    try {
        const { facilityId } = req.params;
        const { status } = req.body; // Expecting 'approved' or 'rejected'

        if (status !== 'approved' && status !== 'rejected') {
            return res.status(400).json({ message: "Invalid status provided. Must be 'approved' or 'rejected'." });
        }

        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found.' });
        }

        facility.status = status;
        await facility.save();

        res.status(200).json({ message: `Facility has been ${status}.`, facility });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update facility status.', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'fullName', 'email', 'role', 'status', 'createdAt']
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
};

// Update a user's status (ban/unban)
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (status !== 'active' && status !== 'banned') {
            return res.status(400).json({ message: "Invalid status provided." });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent admin from banning themselves
        if (user.id === req.userData.userId) {
            return res.status(403).json({ message: "Admin cannot change their own status." });
        }

        user.status = status;
        await user.save();
        res.status(200).json({ message: `User status updated to ${status}.` });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status.' });
    }
};