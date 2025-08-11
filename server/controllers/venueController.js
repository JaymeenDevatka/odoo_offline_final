const { Facility, Court, Review, User, FacilityPhoto } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const { sequelize } = require("../models");

// Fetches all approved facilities with search and filter capabilities
exports.getApprovedVenues = async (req, res) => {
    // Add this log to see exactly what the backend receives
    console.log('Backend received filters:', req.query); 
    try {
        const { search, sportType, maxPrice, venueType, minRating, page = 1 } = req.query;
        const limit = 9;
        const offset = (page - 1) * limit;

        // --- Base Query Options ---
        let findOptions = {
            where: { status: 'approved' },
            include: [
                { model: Court, attributes: ['sportType', 'pricePerHour'] },
                { model: Review, attributes: ['rating'] }
            ],
            limit: limit,
            offset: offset,
            distinct: true // Important for correct counting with includes
        };

        // --- Apply Search Filter ---
        if (search) {
            findOptions.where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } }
            ];
        }

        // --- Apply Other Filters ---
        if (venueType) {
            findOptions.where.venueType = venueType;
        }
        if (sportType) {
            findOptions.include[0].where = { sportType: { [Op.like]: `%${sportType}%` } };
            findOptions.include[0].required = true;
        }
        if (maxPrice) {
            // If sportType filter is also active, add to its where clause
            if (findOptions.include[0].where) {
                findOptions.include[0].where.pricePerHour = { [Op.lte]: maxPrice };
            } else {
                findOptions.include[0].where = { pricePerHour: { [Op.lte]: maxPrice } };
                findOptions.include[0].required = true;
            }
        }

        // --- Fetch and Process Data ---
        const { count, rows: venues } = await Facility.findAndCountAll(findOptions);

        // Manually process the results to calculate aggregates and apply rating filter
        const processedVenues = venues.map(venue => {
            const plainVenue = venue.get({ plain: true });
            
            const startingPrice = plainVenue.Courts?.length > 0 ? Math.min(...plainVenue.Courts.map(c => c.pricePerHour)) : 0;
            const averageRating = plainVenue.Reviews?.length > 0 ? plainVenue.Reviews.reduce((acc, r) => acc + r.rating, 0) / plainVenue.Reviews.length : 0;
            const sportTypes = [...new Set(plainVenue.Courts.map(c => c.sportType))].join(',');

            return {
                id: plainVenue.id,
                name: plainVenue.name,
                address: plainVenue.address,
                startingPrice,
                averageRating: averageRating.toFixed(1),
                sportTypes
            };
        }).filter(venue => {
            // Apply rating filter after calculation
            return minRating ? venue.averageRating >= minRating : true;
        });

        res.status(200).json({
            venues: processedVenues,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error("VENUE FETCH ERROR:", error);
        res.status(500).json({ message: 'Failed to fetch venues.' });
    }
};

exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Facility.findOne({
      where: { id: id, status: "approved" },
      include: [
        {
          model: Court,
          attributes: ["id", "name", "sportType", "pricePerHour"],
        },
        {
          model: Review,
          include: [{ model: User, attributes: ["fullName", "avatar"] }],
        },
        { model: FacilityPhoto, attributes: ["id", "imageUrl"] }, // 👈 Include the photos
      ],
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
