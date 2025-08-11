const { Facility, Court, Booking, User, sequelize } = require('../models');
const { fn, col } = require('sequelize');

// Get all data needed for the owner's dashboard
exports.getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.userData.userId;

        const facility = await Facility.findOne({
            where: { ownerId: ownerId },
            include: [{
                model: Court,
                include: [{
                    model: Booking,
                    include: [{ model: User, attributes: ['fullName', 'email'] }]
                }]
            }]
        });

        if (!facility) {
            return res.status(404).json({ message: "You have not created a facility yet." });
        }

        const totalBookings = facility.Courts.reduce((acc, court) => acc + court.Bookings.length, 0);
        const totalEarnings = await Booking.sum('totalPrice', {
            include: [{
                model: Court,
                where: { facilityId: facility.id }
            }]
        });

        res.status(200).json({
            facility,
            kpis: {
                totalBookings,
                totalEarnings: totalEarnings || 0,
                activeCourts: facility.Courts.length
            }
        });
    } catch (error) {
        console.error("OWNER DASHBOARD ERROR:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data." });
    }
};

// Get aggregated data formatted for charts
exports.getChartData = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const facility = await Facility.findOne({ where: { ownerId } });
        if (!facility) {
            return res.status(404).json({ message: "Facility not found." });
        }

        // 1. Daily Booking Trends (already exists)
        const bookingTrends = await Booking.findAll({
            attributes: [
                [fn('DATE', col('bookingStartTime')), 'date'],
                [fn('COUNT', col('id')), 'count']
            ],
            include: [{ model: Court, attributes: [], where: { facilityId: facility.id } }],
            group: ['date'],
            order: [['date', 'ASC']]
        });
        
        // 2. Peak Booking Hours (already exists)
        const peakHours = await Booking.findAll({
            attributes: [
                [fn('HOUR', col('bookingStartTime')), 'hour'],
                [fn('COUNT', col('id')), 'count']
            ],
            include: [{ model: Court, attributes: [], where: { facilityId: facility.id } }],
            group: ['hour'],
            order: [['hour', 'ASC']]
        });

        // 3. 👇 NEW: Earnings Summary by Court
        const earningsSummary = await Court.findAll({
            attributes: [
                'name',
                [fn('SUM', col('Bookings.totalPrice')), 'totalEarnings']
            ],
            include: [{
                model: Booking,
                attributes: []
            }],
            where: { facilityId: facility.id },
            group: ['Court.id'],
            having: literal('totalEarnings > 0') // Only include courts with earnings
        });

        res.status(200).json({ bookingTrends, peakHours, earningsSummary });
    } catch (error) {
        console.error("CHART DATA ERROR:", error);
        res.status(500).json({ message: "Failed to fetch chart data." });
    }
};

// Add a new court to the owner's facility
exports.addCourt = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const { name, sportType, pricePerHour } = req.body;
        const facility = await Facility.findOne({ where: { ownerId } });
        if (!facility) {
            return res.status(404).json({ message: "Facility not found for this owner." });
        }
        const newCourt = await Court.create({ name, sportType, pricePerHour, facilityId: facility.id });
        res.status(201).json({ message: 'Court added successfully!', court: newCourt });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add court.', error: error.message });
    }
};

// Update an existing court
exports.updateCourt = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const { courtId } = req.params;
        const { name, sportType, pricePerHour } = req.body;
        const court = await Court.findByPk(courtId, { include: Facility });
        if (!court || court.Facility.ownerId !== ownerId) {
            return res.status(403).json({ message: "Access denied. You do not own this court." });
        }
        court.name = name;
        court.sportType = sportType;
        court.pricePerHour = pricePerHour;
        await court.save();
        res.status(200).json({ message: 'Court updated successfully!', court });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update court.', error: error.message });
    }
};

// Delete a court
exports.deleteCourt = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const { courtId } = req.params;
        const court = await Court.findByPk(courtId, { include: Facility });
        if (!court || court.Facility.ownerId !== ownerId) {
            return res.status(403).json({ message: "Access denied." });
        }
        await court.destroy();
        res.status(200).json({ message: 'Court deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete court.', error: error.message });
    }
};

// Get the owner's facility for the management page
exports.getMyFacility = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const facility = await Facility.findOne({
            where: { ownerId },
            include: [{ model: FacilityPhoto }]
        });
        if (!facility) return res.status(404).json({ message: "Facility not found." });
        res.status(200).json(facility);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch facility data." });
    }
};

// Update the owner's facility details
exports.updateMyFacility = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const { name, description, address, amenities, venueType } = req.body;
        
        const facility = await Facility.findOne({ where: { ownerId } });
        if (!facility) return res.status(404).json({ message: "Facility not found." });

        facility.name = name;
        facility.description = description;
        facility.address = address;
        facility.amenities = amenities;
        facility.venueType = venueType;
        await facility.save();

        res.status(200).json({ message: 'Facility details updated successfully!', facility });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update facility.' });
    }
};

// Add a new photo to the facility
exports.addFacilityPhoto = async (req, res) => {
    try {
        const ownerId = req.userData.userId;
        const { imageUrl } = req.body;

        const facility = await Facility.findOne({ where: { ownerId } });
        if (!facility) return res.status(404).json({ message: "Facility not found." });

        const newPhoto = await FacilityPhoto.create({ imageUrl, facilityId: facility.id });
        res.status(201).json({ message: 'Photo added!', photo: newPhoto });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add photo.' });
    }
};