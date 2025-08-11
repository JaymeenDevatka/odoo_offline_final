const { Facility, Court, Review, User } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const { sequelize } = require("../models");

// Fetches all approved facilities with search and filter capabilities
exports.getApprovedVenues = async (req, res) => {
  try {
    const {
      search,
      sportType,
      maxPrice,
      venueType,
      minRating,
      page = 1,
    } = req.query;
    const limit = 9;
    const offset = (page - 1) * limit;

    let whereClause = { status: "approved" };
    if (search) {
      /* ... same as before ... */
    }
    if (venueType) {
      // 👈 Filter for venue type
      whereClause.venueType = venueType;
    }

    let courtWhereClause = {};
    if (sportType) {
      /* ... same as before ... */
    }
    if (maxPrice) {
      /* ... same as before ... */
    }

    // 👇 HAVING clause for filtering by average rating
    let havingClause = minRating
      ? literal(`AVG(Reviews.rating) >= ${minRating}`)
      : null;

    const { count, rows: venues } = await Facility.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "name",
        "address",
        "venueType",
        [fn("AVG", col("Reviews.rating")), "averageRating"],
        [fn("MIN", col("Courts.pricePerHour")), "startingPrice"],
        // 👇 This is the new line. It creates a comma-separated list of unique sports.
        [
          fn("GROUP_CONCAT", fn("DISTINCT", col("Courts.sportType"))),
          "sportTypes",
        ],
      ],
      include: [
        // ... your existing includes for Court and Review ...
      ],
      group: ["Facility.id"],
      having: havingClause,
      limit: limit,
      offset: offset,
      subQuery: false,
    });

    res.status(200).json({
      venues: venues,
      totalPages: Math.ceil(count.length / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("VENUE FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch venues." });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Facility.findOne({
      where: { id: id, status: "approved" },
      include: [
        {
          model: Court, // Include the associated courts
          attributes: ["id", "name", "sportType", "pricePerHour"],
        },
      ],
      // Later you can also include Photos, Reviews, etc.
    });

    if (!venue) {
      return res
        .status(404)
        .json({ message: "Venue not found or not approved." });
    }

    res.status(200).json(venue);
  } catch (error) {
    console.error("SINGLE VENUE FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch venue details." });
  }
};

exports.getPopularVenues = async (req, res) => {
  try {
    const venues = await Facility.findAll({
      where: { status: "approved" },
      order: [
        [sequelize.fn("RAND")], // Fetches random rows. For PostgreSQL, use sequelize.fn('RANDOM')
      ],
      limit: 3, // Let's feature 3 venues
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular venues." });
  }
};
