const { Review, Booking, Court } = require('../models');

exports.addReview = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { facilityId } = req.params;
        const { rating, comment } = req.body;

        // Business Logic: Check if user has a completed booking for this facility
        const canReview = await Booking.findOne({
            where: {
                userId: userId,
                status: 'Completed'
            },
            include: [{
                model: Court,
                where: { facilityId: facilityId }
            }]
        });

        if (!canReview) {
            return res.status(403).json({ message: "You can only review facilities where you have a completed booking." });
        }

        const newReview = await Review.create({ rating, comment, userId, facilityId });
        res.status(201).json({ message: 'Thank you for your review!', review: newReview });

    } catch (error) {
        res.status(500).json({ message: 'Failed to submit review.' });
    }
};