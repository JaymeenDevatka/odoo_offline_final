const { Facility, User } = require('../models');
const {  Booking, Court } = require('../models');
const { fn, col, literal } = require('sequelize');

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

// Get all stats and chart data for the main admin dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. KPIs
        const totalUsers = await User.count();
        const totalOwners = await User.count({ where: { role: 'owner' } });
        const totalBookings = await Booking.count();
        const totalActiveCourts = await Court.count({
            include: [{ model: Facility, where: { status: 'approved' }, attributes: [] }]
        });

        // 2. Chart Data
        const bookingActivity = await Booking.findAll({
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });

        const userRegistrations = await User.findAll({
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });

        const mostActiveSports = await Court.findAll({
            attributes: [
                'sportType',
                [fn('COUNT', col('Bookings.id')), 'bookingCount']
            ],
            include: [{ model: Booking, attributes: [] }],
            group: ['sportType'],
            order: [[literal('bookingCount'), 'DESC']],
            limit: 5
        });

        res.status(200).json({
            kpis: { totalUsers, totalOwners, totalBookings, totalActiveCourts },
            charts: { bookingActivity, userRegistrations, mostActiveSports }
        });
    } catch (error) {
        console.error("ADMIN STATS ERROR:", error);
        res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
    }
}