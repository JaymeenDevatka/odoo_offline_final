const { Booking, Court, Facility } = require("../models");
const { Op } = require("sequelize");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.userData.userId;
    // 👇 Get duration from the request body
    const { courtId, bookingStartTime, durationInHours = 1 } = req.body;

    const startTime = new Date(bookingStartTime);
    // 👇 Calculate end time based on duration
    const bookingEndTime = new Date(
      startTime.getTime() + durationInHours * 60 * 60 * 1000
    );

    // ... (The existing logic for checking overlaps remains the same) ...
    const existingBooking = await Booking.findOne({
      /* ... */
    });
    if (existingBooking) {
      /* ... */
    }

    const court = await Court.findByPk(courtId);
    // 👇 Calculate total price based on duration
    const totalPrice = court.pricePerHour * durationInHours;

    const newBooking = await Booking.create({
      userId,
      courtId,
      bookingStartTime,
      bookingEndTime,
      totalPrice, // Use the new dynamic price
      status: "Confirmed",
    });

    res
      .status(201)
      .json({ message: "Booking confirmed!", booking: newBooking });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while creating your booking." });
  }
};

// Get all bookings for the currently logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const bookings = await Booking.findAll({
      where: { userId: userId },
      include: [
        {
          model: Court,
          attributes: ["name", "sportType"],
          include: [
            {
              model: Facility,
              attributes: ["name", "address"],
            },
          ],
        },
      ],
      order: [["bookingStartTime", "DESC"]],
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your bookings." });
  }
};

exports.cancelBooking = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required.' });
        }

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Security check: User can only cancel their own bookings
        if (booking.userId !== userId) {
            return res.status(403).json({ message: 'Access denied. You can only cancel your own bookings.' });
        }
        
        // Business logic: Check if the booking is already cancelled or completed
        if (booking.status !== 'Confirmed') {
            return res.status(400).json({ message: `Cannot cancel a booking with status: ${booking.status}.` });
        }

        // Business logic: User can only cancel future bookings
        // This comparison is now more robust
        if (new Date(booking.bookingStartTime) < new Date()) {
            return res.status(400).json({ message: 'This booking has already passed and cannot be cancelled.' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Your booking has been cancelled successfully.' });

    } catch (error) {
        // Add detailed logging for better debugging on the server
        console.error("CANCEL BOOKING ERROR:", error);
        res.status(500).json({ message: 'An unexpected error occurred while trying to cancel the booking.' });
    }
};
