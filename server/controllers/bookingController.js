const { Booking, Court, Facility, BlockedSlot } = require("../models");
const { Op } = require("sequelize");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { courtId, bookingStartTime, durationInHours = 1 } = req.body;

    const startTime = new Date(bookingStartTime);
    const endTime = new Date(
      startTime.getTime() + durationInHours * 60 * 60 * 1000
    );

    const court = await Court.findByPk(courtId);
    if (!court) {
        return res.status(404).json({ message: 'Court not found.' });
    }

    // Check 1: Is the court open at this hour?
    if (court.operatingHoursStart && court.operatingHoursEnd) {
        const bookingHour = startTime.getHours();
        const openingHour = parseInt(court.operatingHoursStart.split(':')[0]);
        const closingHour = parseInt(court.operatingHoursEnd.split(':')[0]);
        if (bookingHour < openingHour || bookingHour >= closingHour) {
            return res.status(400).json({ message: `This court is only open from ${court.operatingHoursStart} to ${court.operatingHoursEnd}.` });
        }
    }

    // Check 2: Is this slot manually blocked for maintenance?
    const isBlocked = await BlockedSlot.findOne({
        where: {
            courtId: courtId,
            [Op.or]: [
                { startTime: { [Op.lt]: endTime, [Op.gt]: startTime } },
                { endTime: { [Op.lt]: endTime, [Op.gt]: startTime } },
                { startTime: { [Op.lte]: startTime }, endTime: { [Op.gte]: endTime } }
            ]
        }
    });
    if (isBlocked) {
        return res.status(409).json({ message: `This time slot is blocked for: ${isBlocked.reason}.` });
    }

    // Check 3: Is there an overlapping booking?
    const existingBooking = await Booking.findOne({
      where: {
        courtId: courtId,
        status: { [Op.ne]: 'Cancelled' }, // Don't check against cancelled bookings
        [Op.or]: [
            { bookingStartTime: { [Op.lt]: endTime, [Op.gt]: startTime } },
            { bookingEndTime: { [Op.lt]: endTime, [Op.gt]: startTime } },
            { bookingStartTime: { [Op.lte]: startTime }, bookingEndTime: { [Op.gte]: endTime } }
        ]
      },
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This time slot is already booked. Please choose another time." });
    }

    const totalPrice = court.pricePerHour * durationInHours;

    const newBooking = await Booking.create({
      userId,
      courtId,
      bookingStartTime: startTime,
      bookingEndTime: endTime,
      totalPrice,
      status: "Pending", // New bookings are now pending approval
    });

    res
      .status(201)
      .json({ message: "Booking request sent! You will be notified upon confirmation.", booking: newBooking });
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

// Cancel a booking
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

        if (booking.userId !== userId) {
            return res.status(403).json({ message: 'Access denied. You can only cancel your own bookings.' });
        }
        
        if (booking.status !== 'Confirmed' && booking.status !== 'Pending') {
            return res.status(400).json({ message: `Cannot cancel a booking with status: ${booking.status}.` });
        }

        if (new Date(booking.bookingStartTime) < new Date()) {
            return res.status(400).json({ message: 'This booking has already passed and cannot be cancelled.' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Your booking has been cancelled successfully.' });

    } catch (error) {
        console.error("CANCEL BOOKING ERROR:", error);
        res.status(500).json({ message: 'An unexpected error occurred while trying to cancel the booking.' });
    }
};
