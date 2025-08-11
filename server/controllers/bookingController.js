const { Booking, Court, Facility } = require('../models');
const { Op } = require('sequelize');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { courtId, bookingStartTime } = req.body;

        // For simplicity, we'll assume all bookings are 1 hour long
        const bookingEndTime = new Date(new Date(bookingStartTime).getTime() + 60 * 60 * 1000);

        // 1. Check for overlapping bookings for the same court
        const existingBooking = await Booking.findOne({
            where: {
                courtId: courtId,
                // This logic checks if the requested slot overlaps with an existing booking
                [Op.or]: [
                    { bookingStartTime: { [Op.lt]: bookingEndTime } },
                    { bookingEndTime: { [Op.gt]: bookingStartTime } }
                ]
            }
        });

        if (existingBooking) {
            return res.status(409).json({ message: 'This time slot is already booked. Please choose another time.' });
        }

        // 2. Create the booking
        const court = await Court.findByPk(courtId);
        const newBooking = await Booking.create({
            userId,
            courtId,
            bookingStartTime,
            bookingEndTime,
            totalPrice: court.pricePerHour, // Assuming 1-hour booking
            status: 'Confirmed'
        });

        res.status(201).json({ message: 'Booking confirmed!', booking: newBooking });

    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        res.status(500).json({ message: 'Something went wrong while creating your booking.' });
    }
};

// Get all bookings for the currently logged-in user
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const bookings = await Booking.findAll({
            where: { userId: userId },
            include: [{
                model: Court,
                attributes: ['name', 'sportType'],
                include: [{
                    model: Facility,
                    attributes: ['name', 'address']
                }]
            }],
            order: [['bookingStartTime', 'DESC']]
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your bookings.' });
    }
};